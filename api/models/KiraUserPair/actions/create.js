import { applyParams, save, ActionOptions, CreateKiraUserPairActionContext } from "gadget-server";

/**
 * @param { CreateKiraUserPairActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateKiraUserPairActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
