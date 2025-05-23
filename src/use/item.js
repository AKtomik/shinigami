import { equal } from "assert";
import { api } from "gadget-server";
import { itemType } from "../enum";
import { translate } from "../lang";
import { sett_emoji_pens, sett_emoji_objects } from "../sett";
import { kira_apple_send } from "./apple";

export const items_info = {
  event_egg_2025: {
    type: itemType.COLLECTOR,
    emoji: sett_emoji_objects.event_egg_2025,
    message_claim: true,
    message_lore: true,
    dolarsPath: [
      "user.id",
      "user.username"
    ],
  },


  pen_black: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.black,
    message_claim: false,
    message_lore: true,
  },
  
  pen_blue: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.blue,
    message_claim: false,
    message_lore: true,
  },
  
  pen_green: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.green,
    message_claim: false,
    message_lore: true,
  },

  pen_red: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.red,
    message_claim: false,
    message_lore: true,
  },
  
  pen_purple: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.purple,
    message_claim: false,
    message_lore: true,
  },
  
  feather_white: {
    type: itemType.PEN,
    emoji: sett_emoji_pens.feather,
    message_claim: false,
    message_lore: true,
  },
  
  broken_pen: {
    type: itemType.JUNK,
    emoji: sett_emoji_pens.broken,
    message_claim: false,
    message_lore: true,
  },
}

export async function kira_item_create(userdataId, lang, itemName, dolarValues = {}, metaDataValues = {}, returnClaimMsg=false) {

  let itemLoreTxt = undefined;
  let itemLoreDict = {};
  if (items_info[itemName].message_lore)
  {
    if (items_info[itemName].dolarsPath)
    {
      for (let fullKey of items_info[itemName].dolarsPath)
      {
        const path = fullKey.split(".");
        let getting = dolarValues;

        for (let p of path) {
          getting = getting?.[p];
        }
        itemLoreDict[fullKey]=getting;
      }
    }
    itemLoreTxt = translate(lang, "item."+itemName+".lore", dolarValues);
  }

  const pen=await api.KiraItems.create({
    ownerPtr: {
      _link: userdataId,
    },
    itemName,
    itemLoreTxt: {markdown: itemLoreTxt},
    itemLoreDict,
    meta: metaDataValues
  });
  
  return (returnClaimMsg) 
  ? (items_info[itemName].message_claim) 
    ? translate(lang, "item."+itemName+".claim", dolarValues)+"\n"
    : ""
  : pen;
}

//GET

export function kira_item_title(lang, itemName, withEmoji=true)
{
  return ((withEmoji)
    ? `<:${items_info[itemName].emoji.name}:${items_info[itemName].emoji.id}> `
    : '')
  + translate(lang, "item."+itemName+".title");
};


// get all
export async function kira_items_ids(userdataId) {
  return await api.KiraItems.findMany({
    filter: {
      ownerPtr: {
        equals: userdataId,
      },
    },
    select: {
      id: true,
      itemName: true,
    }
  });
}

// get by string id
export async function kira_item_find(userdataId, itemName) {
  return await api.KiraItems.maybeFindFirst({
    filter: {
      ownerPtr: {
        equals: userdataId,
      },
      itemName: (itemName) ? {equals: itemName} : undefined
    }
  });
}
export async function kira_items_find(userdataId, itemName) {
  return await api.KiraItems.findMany({
    filter: {
      ownerPtr: {
        equals: userdataId,
      },
      itemName: (itemName) ? {equals: itemName} : undefined
    }
  });
}

// get by numeric id
export async function kira_item_get(userdataId, itemId) {
  return await api.KiraItems.maybeFindFirst({
    filter: {
      ownerPtr: {
        equals: userdataId,
      },
      id: {equals: itemId}
    }
  });
}

// drop and gift

// delete
export async function kira_item_delete(userdataId, itemId) {
  if (!await kira_item_get(userdataId, itemId)) return false;
  await api.KiraItems.delete(itemId);
  return true;
}

export async function kira_item_unequip(userdata, itemId)
{
  // pen
  if (toString(userdata.equipedPen.id)===toString(itemId))
  {
    await api.KiraUsers.update(userdata.id, {equipedPen: {_link: null}});
  }

  return;
}

export async function kira_item_gift_send_item(itemId, userdataOwner, usernameOwner, userIdRecipient) {
  if (!await kira_item_get(userdataOwner.id, itemId)) return false;
  await kira_item_unequip(userdataOwner, itemId);
  //await api.KiraUsers.update(itemId, {myItems: {_unlink:[{id: userdataIdOwner}]}});//not this way
  await api.KiraItems.update(itemId, {ownerPtr: {_link:null}});
  return await api.KiraItemGift.create({itemPtr: {_link: itemId}, userIdOwner: userdataOwner.userId, usernameOwner, userIdRecipient});
}

export async function kira_item_gift_send_apples(appleAmount, userdataOwner, usernameOwner, userIdRecipient) {
  //await kira_apple_send(userdataOwner.id, appleAmount*-1, userdataOwner.statPtr.id, "gift.send."+(userIdRecipient) ? "one" : "everyone", {gifted: });//got lazy
  await kira_apple_send(userdataOwner.id, appleAmount*-1, userdataOwner.statPtr.id, "gift.send.everyone");
  return await api.KiraItemGift.create({appleAmount, userIdOwner: userdataOwner.userId, usernameOwner, userIdRecipient});
}


export async function kira_item_gift_get(giftId) {
  return await api.KiraItemGift.maybeFindFirst({filter: {id: {equals: giftId}}});
}


export async function kira_item_gift_pick(gift, userdata) {
  await api.KiraItemGift.delete(gift.id);
  if (gift.appleAmount)
  {
    return await kira_apple_send(userdata.id, gift.appleAmount, userdata.statPtr.id, "gift.recive", {"gifter": gift.usernameOwner});
  } else {
    return await api.KiraItems.update(gift.itemPtrId, {ownerPtr: {_link: userdata.id}});
  }
}

//export async function kira_item_gift_pick(userdataId, giftId) {
//  const gift=await api.KiraItemGift.maybeFindFirst({id: giftId});
//  if (!gift) return false;
//  if (gift.userdataIdRecipient && gift.userdataIdRecipient!==userdataId) return false;

//  await api.KiraItemGift.remove(gift.id);
//  return await api.KiraItems.update(gift.itemPtr.id, {ownerPtr: {_link: userdataId}});
//}