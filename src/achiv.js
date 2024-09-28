import { api } from "gadget-server";

import { kira_apple_claims_add } from "./apple.js";
import { translate } from "./lang.js";
import { roman_from_int } from "./tools.js";

import { DiscordRequest } from "../utils.js";


const achievements = {
	"test1": {
		modelKey: "done_test1",
		maxLevel: 1,
		rewards: [10],
	},
	"test2": {
		modelKey: "level_test2",
		maxLevel: 8,
		rewards: [1, 2, 3, 4, 5, 6, 7, 8],
		graduations: [5, 10, 20, 50, 100, 200, 500, 1000],
		hidden: false,
		//rewardCalc: (level) => (level),
		//graduationCalc: (value) => (Math.floor(value/10))
	},

	"kill": {
		modelKey: "level_kill",
		maxLevel: 5,
		graduations: [5, 10, 20, 50, 100],
		hidden: false,
	},
	"counter": {
		modelKey: "level_counter",
		maxLevel: 5,
		graduations: [5, 10, 20, 50, 100],
		hidden: false,
	},
	"outerTime": {
		modelKey: "level_outerTime",
		maxLevel: 5,
		graduations: [3600, 86400, 604800, 2592000, 31557600],
		hidden: false,
	},
	
	"writtenPage": {
		modelKey: "level_writtenPage",
		maxLevel: 3,
		graduations: [3, 10, 70],
		hidden: false,
	},
	"killKiller": {
		modelKey: "level_killKiller",
		maxLevel: 3,
		graduations: [5, 15, 100],
		hidden: false,
	},
	"appleStreak": {
		modelKey: "level_appleStreak",
		maxLevel: 3,
		graduations: [3, 7, 30],
		hidden: false,
	},
	
	"outer23d": {
		modelKey: "done_outer23d",
		maxLevel: 1,
		hidden: false,
	},
	"counterMax": {
		modelKey: "done_counterMax",
		maxLevel: 1,
		hidden: false,
	},
	"murdersOn": {
		modelKey: "done_murdersOn",
		maxLevel: 1,
		graduations: [10],
		hidden: true,
	},
}
const achievements_list = [
"kill", "counter", "outerTime", "writtenPage", "killKiller", "appleStreak", "outer23d", "counterMax", "murdersOn",
];

//GET
async function achiv_get_level(f_achivModelId, f_achivKey)
{
	const received_level=await api.KiraUserAchiv.findOne(f_achivModelId, {select: {[achievements[f_achivKey].modelKey]: true}}).then(obj => obj[achievements[f_achivKey].modelKey]);
	return ((received_level===null) ? 0 : received_level);//need in particular for when new achievements added
}

async function achiv_set_level(f_achivModelId, f_achivKey, f_setLevel)
{
	await api.KiraUserAchiv.update(f_achivModelId, {[achievements[f_achivKey].modelKey]: f_setLevel});
}

export function achiv_graduate_level(f_achivKey, f_value)
{
	//if (achievements[f_achivKey].graduateValues && achievements[f_achivKey].graduateValues[f_value])
	//	return achievements[f_achivKey].graduateValues[f_value];
	//return achievements[f_achivKey].graduationCalc(f_value);
	if (achievements[f_achivKey].graduations)
	{
		let i=0;
		for (i=0;i<achievements[f_achivKey].graduations.length && f_value>=achievements[f_achivKey].graduations[i];i++)
		return i;
	}
}


//SET
export async function achiv_grant_level(f_userModel, f_lang, f_achivKey, f_newLevel=1, f_doneDolarValues={})
{
	const achivModelId=f_userModel.achivPtr.id;
	//get actual level
	const h_registerLevel=await achiv_get_level(achivModelId, f_achivKey);
	//new level maxed to maxlevel
	const maxLevel=achievements[f_achivKey].maxLevel;
	if (f_newLevel>maxLevel)
		f_newLevel=maxLevel;
	//values
	const h_gap=f_newLevel - h_registerLevel;
	let h_apples=0;
	//if has a greater level
	if (f_newLevel > h_registerLevel)
	{
		console.log(`DBUG : achiv : pass [${f_achivKey}] from ${f_newLevel} to ${h_registerLevel}`)
		//set the level
		await achiv_set_level(achivModelId, f_achivKey, f_newLevel);
		if (achievements[f_achivKey].rewards)
		{
			//all level passed
			for (let level=h_registerLevel;level<f_newLevel;level++)
			{
				console.log(`HI : ${h_apples}+=${achievements[f_achivKey].rewards[level]}=achievements[${f_achivKey}].rewards[${level}]`);
				h_apples+=achievements[f_achivKey].rewards[level];
			}
			console.log(`HI : ${h_registerLevel}<${f_newLevel} : ${h_apples} | ${achievements[f_achivKey].rewards}`);

			//add apple
			if (h_apples>0)
		    await kira_apple_claims_add(f_userModel.id, {
		      added: h_apples,
		      type: "quest",
		      achievementKey: f_achivKey,
					levelNew: f_newLevel,
		    });
		}

		//message
		{
			const yayTypeStr=(maxLevel===1) ? "unic" : (maxLevel===f_newLevel) ? "maxed" : "level";
			let sending_content=translate(f_lang, `achievement.done.yay.${yayTypeStr}`, {name: translate(f_lang, `achievements.${f_achivKey}.title`), level: roman_from_int(f_newLevel)});;
			const doneMessage=translate(f_lang, `achievements.${f_achivKey}.done`, f_doneDolarValues);
			sending_content+="\n"+doneMessage;

			if (h_apples>0)
				sending_content+="\n"+translate(f_lang, "achievement.done.apple", {number: h_apples, unit: translate(f_lang, `word.apple${h_apples > 1 ? "s" : ""}`),});

	    //open DM
	    const received_dm = await DiscordRequest(`users/@me/channels`, {
	      method: "POST",
	      body: {
	        recipient_id: f_userModel.userId,
	      },
	    }).then((res) => res.json());
	    //send message
	    try {
	      await DiscordRequest(
	        `channels/${received_dm.id}/messages`,
	        {
	          method: "POST",
	          body: {
	            content: sending_content
	          },
	        }
	      ).then((res) => res.json());
	    } catch (e) {
	      let errorMsg = JSON.parse(e.message);
	      if (errorMsg?.code === 50007) {
	      } else throw e;
	    }
		}

	}
	return h_gap;
}


//STRING
export async function achiv_list_get(f_userdata, f_lang)
{
	const userAchiv=await api.KiraUserAchiv.findOne(f_userdata.statPtr.id);
	let r_list_txt="";
	let h_displayedLines=0;
	
	for (const achivKey of achievements_list)
	{
		const achivValue=userAchiv[achievements[achivKey].modelKey];
		let translateKey="achievement.line";
		let translateInfos={};

		if (achivValue===undefined)
		{
			throw new Error(`KiraUserAchiv attribute is expected, but is not defined.\nis key [${achievements[achivKey].modelKey}] in the database?`);
		}
		
		if (achievements[achivKey].hidden && (achivValue===0 || achivValue===null))
		{//hidden
			translateKey+=".hidden";
		} else {
			translateInfos={
				"title": translate(f_lang, `achievements.${achivKey}.title`),
				"lore": translate(f_lang, `achievements.${achivKey}.lore`),
			};
			if (achievements[achivKey].maxLevel===1)
			{
				translateKey+=".done";
				if (achievements[achivKey].maxLevel===achivValue) {
					translateKey+=".finish";
				} else {
					translateKey+=".zero";
				}
			} else {
				translateKey+=".level";
				//translateInfos["level"]="<"+achivValue+">";
				translateInfos["level"]=roman_from_int(achivValue);
				translateInfos["max"]=roman_from_int(achievements[achivKey].maxLevel);
				if (achivValue===0 || achivValue===null)
				{
					translateKey+=".zero";
				} else if (achievements[achivKey].maxLevel===achivValue) {
					translateKey+=".finish";
				} else {
					translateKey+=".step";
				}
			}
		}
		
		{
			if (h_displayedLines>0) r_list_txt+="\n";
			h_displayedLines+=1;
			r_list_txt+=translate(f_lang, translateKey, translateInfos);
		}
		;
	}

	return {
		content: translate(f_lang, "achievement.show", {"amount":0, "max":1}),
    embeds: [
      {
        description: r_list_txt
        //color: book_colors[userbook.color].int,
      },
    ],
	};
}