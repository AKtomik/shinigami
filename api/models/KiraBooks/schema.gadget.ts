import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "KiraBooks" model, go to https://shinigami.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "QKAfU7RSLj_r",
  fields: {
    index: {
      type: "number",
      default: 0,
      storageKey: "vmXzMfwAfqKZ::rMik1-7hyux1",
    },
    itemId: { type: "string", storageKey: "U5ZX7Q_bVJfX" },
    itemName: { type: "string", storageKey: "ZU-b6qC31Fxk" },
    lastNoteId: {
      type: "string",
      storageKey: "eJP-KDJwE-QR::gJDYOmlFxvF5",
    },
    notesPtr: {
      type: "hasMany",
      children: {
        model: "KiraNotes",
        belongsToField: "attackerBookPtr",
      },
      storageKey: "Jtt1CwS0jzFN::78HP6MC2vS-K",
    },
    oldColorIndex: {
      type: "number",
      default: 0,
      storageKey: "ii217u7WjZs-::IErty4wRhxVC",
    },
    owner: {
      type: "belongsTo",
      parent: { model: "KiraUsers" },
      storageKey: "yPEocCeFGmWb::Un0pqDvHhn0t",
    },
    ownerUserId: {
      type: "string",
      storageKey: "ig49tU621fkR::SvA9LHRntTO9",
    },
    writterPtr: {
      type: "hasOne",
      child: { model: "KiraUsers", belongsToField: "noteBook" },
      storageKey: "oz59brmDEOIR",
    },
  },
};
