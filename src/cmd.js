console.log(` cmd : refresh`);
//--- sett ---

import { KnowUsableBy } from "./enum.ts";

import { Settings } from "./sett.js";

//--- imports ---

//dependancies
import { RouteContext } from "../gadget-server";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  ChannelTypes,
  TextStyleTypes,
} from "discord-interactions";
import { DiscordRequest } from "./utils.js";
import { DiscordUserById, DiscordUserOpenDm } from "./utils.js";

import { SETT_CMD, sett_catalog_drops, sett_catalog_knows, sett_emoji_apple_croc, sett_emoji_apple_none, sett_emoji_burn_confirm, sett_emoji_feedback_confirm } from "./sett.js";

//own
//import { sleep } from './tools.js';

import {
  translate,
  lang_choice,
  lang_lore,
  lang_get,
  lang_set,
} from "./lang.js"; //all user langugage things

import { kira_do_refreshCommands } from "./use/kira.js"; // god register commands
import {
  kira_user_get,
  kira_user_set_life,
  kira_user_get_daily,
  kira_user_set_daily,
  kira_user_add_apple,
  kira_user_set_drop,
  kira_user_get_drop,
} from "./use/kira.js"; //kira user
import { kira_users_rank } from "./use/kira.js"; //kira user
import {
  kira_book_create,
  kira_book_delete,
  kira_book_get,
  kira_book_color_choice,
  book_colors,
} from "./use/kira.js"; //kira book
import {
  kira_run_create,
  kira_run_delete,
  kira_run_get,
  kira_run_of,
  kira_run_pack,
  kira_run_unpack_execute,
  kira_run_unpack_know,
  kira_runs_by,
} from "./use/kira.js"; //kira run
import {
  kira_line_append,
  kira_line_get_page,
  kira_line_get_last_indexPage,
  kira_line_if_pageGood,
  kira_line_taste,
} from "./use/kira.js"; //kira line
import {
  kira_apple_claims_set,
  kira_apple_claims_add,
  kira_apple_claims_get,
  kira_format_applemoji,
} from "./use/apple.js"; //kira apples

import {
  stats_simple_get,
  stats_simple_is_default,
  stats_simple_set,
  stats_simple_add,
  stats_simple_bulkadd,
  stats_parse,
  stats_simple_rank,
  stats_order_broad,
  stats_order_ratio,
} from "./use/stats.js"; // simple user statistics
import {
  stats_pair_get_id,
  stats_pair_get_value,
  stats_pair_add,
  stats_pair_set,
  stats_pairs_get_all,
  stats_pair_get_multiples,
} from "./use/stats.js"; // pair user statstics
import { stats_checkup } from "./use/stats.js"; // update user statistics
import { Achievement, Schedule } from "./achiv.js"; // user achivements

import {
  time_format_string_from_int,
  time_userday_get,
  time_day_int,
  time_day_format,
  time_day_gap,
  roman_from_int,
} from "./tools.js"; // tools

import { kira_remember_task_add, tasksType } from "./use/remember.js";
import { linkme } from "./use/remember.js";
linkme("linked from cmd"); //need to use a function from there

//commands components
import { tricks_all } from "./cmd/trick.js";
import { cmd_rules } from "./cmd/rules.js";
import { register } from "module";

//the structure to describe the command
const commands_structure = {
  //OP
  god: {
    functions: {
      exe: cmd_god,
      checks: [[check_is_god, false]],
    },
    register: {
      name: "god",
      contexts: [0],
      description: "An admin-only command",

      options: [
        {
          type: 3,
          name: "action",
          description: "the action to do",
          required: true,
          choices: [
            {
              name: "test",
              value: "test",
              description: "execute the test script",
            },
            { name: "update", value: "update", description: "update an user" },
            { name: "revive", value: "revive", description: "revive someone" },
            { name: "kill", value: "kill", description: "kill someone" },
            {
              name: "drop",
              value: "drop",
              description: "drop someone's death note",
            },
            {
              name: "mercy",
              value: "mercy",
              description: "cancel someone's death",
            },
            {
              name: "give apple",
              value: "apple_give",
              description: "give apple",
            },
            {
              name: "gift apple",
              value: "apple_fake",
              description: "fake giving apple",
            },
          ],
        },
        {
          type: 6,
          name: "user",
          description: "the potential user to do things on",
          required: false,
        },
        {
          type: 4,
          name: "amount",
          description: "the potential amount",
          required: false,
        },
      ],
      /*
      options: [
        {
          name: 'test',
          description: 'execute the test script',
          type: 1
        },
        {
          name: 'revive',
          description: 'revive someone',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'the person to revive',
              required: true
            },
          ],
          type: 1
        },
        {
          name: 'kill',
          description: 'kill someone',
          options: [
            {
              type: 6,
              name: 'user',
              description: 'the person to kill',
              required: true
            },
          ],
          type: 1
        },
      ],
      */
      type: 1,
    },
  },

  feedback: {
    functions: {
      exe: cmd_feedback,
      checks: [
        [check_react_is_self, true],
      ]
    },
    register: {
      name: "feedback",
      description: "send a message to the realm of the dead"
    },
    atr: {
      ephemeral: true
    }
  },
  feedback_form: {
    functions: {
      exe: cmd_feedback_form,
      checks: [
        [check_react_is_self, true],
      ],
    },
    atr: {
      notDeferred: true,
      systemOnly: true
    },
  },

  //SET
  claim: {
    functions: {
      exe: cmd_claim,
      checks: [
        [check_can_alive, false],
        [check_react_is_self, true],
        [check_has_noDrop, true],
      ],
    },
    register: {
      name: "claim",
      description: "Claim your death note",
      contexts: [0],
      options: [
        {
          type: 4,
          name: "color",
          description: "choose black please",
          choices: kira_book_color_choice(),
        },
      ],
      type: 1,
    },
  },

  burn: {
    functions: {
      exe: cmd_burn,
      checks: [
        [check_can_alive, false],
        [check_react_is_self, true],
        [check_has_noDrop, true],
      ],
    },
    register: {
      name: "burn",
      description: "Burn your death note. Why would you do that?",
      contexts: [0],
      type: 1,
    },
  },

  //GET
  apple: {
    functions: {
      exe: cmd_apple,
      checks: [[check_can_alive, false]],
    },
    register: {
      name: "apple",
      description:
        "Claim your daily apple, claim obtained apples, and get your number of apples",
      contexts: [0],
      type: 1,
    },
  },

  lang: {
    functions: {
      exe: cmd_lang,
      checks: [[check_can_alive, false]],
    },
    register: {
      name: "lang",
      description: "Set/Get the human language I speak",
      contexts: [0],
      options: [
        {
          type: 3,
          name: "language",
          description: "set the language",
          required: false,
          choices: lang_choice([{ name: "<Default>", value: "mine" }]),
        },
      ],
      type: 1,
    },
  },

  stats: {
    functions: {
      exe: cmd_stats,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
      ],
    },
    register: {
      name: "stats",
      description: "Getting your stats",
      contexts: [0],
      type: 1,
      options: [
        {
          type: 3,
          name: "categorie",
          description: "stats about...",
          required: true,
          choices: [
            { name: "General", value: "broad" },
            { name: "Performance", value: "ratio" },
            { name: "People", value: "relation" },
          ],
        },
      ],
    },
  },

  running: {
    functions: {
      exe: cmd_running,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
      ],
    },
    register: {
      name: "running",
      description: "See who will be killed",
      contexts: [0],
      type: 1,
    },
  },

  quest: {
    functions: {
      exe: cmd_quest,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
      ],
    },
    register: {
      name: "quest",
      description: "Your achievements",
      contexts: [0],
      type: 1,
    },
  },

  top: {
    functions: {
      exe: cmd_top,
      checks: [[check_can_alive, false]],
    },
    register: {
      name: "top",
      description: "The top 3 players on multiples things",
      contexts: [0],
      options: [
        {
          type: 3,
          name: "on",
          description: "have the most...",
          required: true,
          choices: [
            { name: "Apples", value: "apple" },
            { name: "Kills", value: "kill" },
            { name: "Murders", value: "murder" },
            { name: "Time", value: "time" },
          ],
        },
      ],
      type: 1,
    },
  },

  rules: {
    functions: {
      exe: cmd_rules,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    register: {
      name: "rules",
      description: "Get a random rules of the death note",
      contexts: [0],
      type: 1,
    },
  },

  see: {
    functions: {
      exe: cmd_see,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    register: {
      name: "see",
      description: "Read what you wrote in your death note",
      contexts: [0],
      options: [
        {
          type: 4,
          name: "page",
          description: "the page to look",
          required: false,
          min_value: 1,
        },
      ],
      type: 1,
    },
  },

  //SET
  drop: {
    functions: {
      exe: cmd_drop,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    register: {
      name: "drop",
      description: "Give up your death note to protect yourself",
      contexts: [0],
      type: 1,
    },
  },

  trick: {
    functions: {
      exe: cmd_trick,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    register: {
      name: "trick",
      description: "Buy funny stuff with apples",
      contexts: [0],
      type: 1,
    },
    //ephemeral: true,
  },
  trick_resp: {
    functions: {
      exe: cmd_trick_resp,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    atr: {
      ephemeral: false,
      systemOnly: true
    }
  },

  trick_resp_eph: {
    functions: {
      exe: cmd_trick_resp_eph,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    atr: {
      ephemeral: true,
      systemOnly: true
    }
  },

  kira: {
    functions: {
      exe: cmd_kira,
      checks: [
        [check_can_alive, false],
        [check_has_noDrop, true],
        [check_has_book, false],
      ],
    },
    register: {
      name: "kira",
      description: "Kill someone after 40 seconds",
      contexts: [0],
      options: [
        {
          type: 6,
          name: "victim",
          description: "the person to kill",
          required: true,
        },
        {
          type: 3,
          name: "reason",
          description: 'is "heart attack" by default',
          required: false,
        },
        {
          type: 4,
          name: "span",
          description: "is 40 seconds by default",
          required: false,
          min_value: 40,
          max_value: 1987200,
        },
      ],
      type: 1,
    },
  },

  know: {
    functions: {
      exe: cmd_know,
      checks: [
        [check_can_alive, true],
        [check_has_noDrop, true],
        [check_has_book, true],
        [check_react_is_self, true]// JUST DONT DO IT NOOOOOOOOOO
      ],
    },
    atr: {
      systemOnly: true,
    }
    /*
    register:
    {
      name: 'know',
      description: 'INDEV',
      contexts: [0],
      options: [
        {
          type: 3,
          name: 'wh',
          description: 'what to know',
          required: true,
          choices: [{ name: "who?", value: "who" }, { name: "where?", value: "where"}]
        },
        {
          type: 4,
          name: 'id',
          description: 'kira_run\'s id',
          required: true
        },
      ],
      type: 1
    }
     */
  },
};

//--- technical ---
//dont have to be edited
export async function kira_cmd(f_deep, f_cmd) {
  /**f_deep :
   * - (api)
   * - ~~reply~~
   * - |lang|
   * - (source)
   *  - data
   *  - type
   *  - (id)
   *  - ([token])
   *  - locale
   *  - user
   *  - message
   *  - channel
   *  - guild
   * datamodels
   * - |userdata|
   * - |userbook|
   */
  // usable ~~unusable~~ (unused) [used here] |created here|

  //console.debug(`cmd : f_deep=`, f_deep);

  //new datas

  //get the user data element
  //if dont exist, it's automaticly created
  f_deep.userdata = await kira_user_get(f_deep.user.id, true);
  //get the user's book
  //if dont exist, is undefined
  f_deep.userbook = await kira_book_get(f_deep.userdata.id);
  //get user lang
  //lang selected, else discord lang
  f_deep.lang = lang_get(f_deep);

  //errors
  if (!commands_structure[f_cmd]) {
    //error 404
    return {
      method: "PATCH",
      body: {
        content: kira_error_msg(
          "error.point.404",
          { message: `unknow command [${f_cmd}]` },
          f_deep.lang
        ),
      },
    };
  }

  let replyed = false; // used only if catch
  try {
    //checks
    for (let v of commands_structure[f_cmd].functions.checks) {
      const r_check = await v[0](f_deep);
      if (r_check) {
        //if the check is not checked
        await DiscordRequest(// POST the deferred response
          `interactions/${f_deep.id}/${f_deep.token}/callback`,
          {
            method: "POST",
            body: {
              type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                flags: v[1] ? InteractionResponseFlags.EPHEMERAL : undefined,
              },
            },
          }
        );
        // PATCH the "no dont" message
        return r_check;
      }
    }

    if (!commands_structure[f_cmd].atr?.notDeferred)
    {

      await DiscordRequest(// POST the deferred response
        `interactions/${f_deep.id}/${f_deep.token}/callback`, {
        method: "POST",
        body: {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: commands_structure[f_cmd].atr?.ephemeral
              ? InteractionResponseFlags.EPHEMERAL
              : undefined,
          },
        },
      });
      replyed = true;
    }
    //PATCH by the returned mesage
    return await commands_structure[f_cmd].functions.exe(f_deep);
  } catch (e) {
    if (!replyed) {
      await DiscordRequest(// POST the deferred response
        `interactions/${f_deep.id}/${f_deep.token}/callback`,
        {
          method: "POST",
          body: {
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
          },
        }
      );
    }
    console.error(`cmd : in js error=`, e);
    //specific error
    if (
      e.message ===
      "[GraphQL] GGT_INTERNAL_ERROR: Unexpected HTTP error from sandbox: Response code 500 (Internal Server Error)"
    ) {
      kira_error_throw(
        //"error.system.protocol",
        "error.critical",
        e,
        f_deep.lang,
        f_deep.token,
        true
      );
    }
    //general error
    console.error(
      `cmd : wrong js code=${e.code} name=${e.name} message=${e.message}`
    );
    kira_error_throw(
      "error.system.wrongjs",
      e,
      f_deep.lang,
      f_deep.token,
      true
    );
    return; // will not bcs throw before
  }
}

export function kira_error_msg(f_errorKey, f_errorObject, f_lang) {
  console.error(`cmd : code=${f_errorObject.code}`);
  return translate(f_lang, f_errorKey, {
    name: f_errorObject.name,
    message: f_errorObject.message,
  });
}

export async function kira_error_throw(
  f_errorKey,
  f_errorObject,
  f_lang,
  f_token,
  f_ifThrow = true
) {
  await DiscordRequest(
    `webhooks/${process.env.APP_ID}/${f_token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        content: kira_error_msg(f_errorKey, f_errorObject, f_lang),
      },
    }
  );
  if (f_ifThrow) throw f_errorObject;
}

export function cmd_register() {
  let r_commandsRegisterAll = [];
  for (let i in commands_structure) {
    if (commands_structure[i].register) {
      r_commandsRegisterAll.push(commands_structure[i].register);
    } else if (!commands_structure[i].atr?.systemOnly) {
      r_commandsRegisterAll.push({
        name: i,
        description: "<no register field>",
        type: 1,
      });
    }
  }
  return r_commandsRegisterAll;
}

//--- the checks ---
//

//"god" check
function check_is_god(dig) {
  if (!dig.userdata.is_god) {
    return {
      method: "PATCH",
      body: {
        content: translate(dig.lang, "check.god.not"),
      },
    };
  }
  return undefined;
}

//"alive" check
function check_is_alive(dig) {
  if (!dig.userdata.is_alive) {
    return {
      method: "PATCH",
      body: {
        content: translate(dig.lang, "check.alive.not"),
      },
    };
  }
  return undefined;
}

async function check_can_alive(dig) {
  if (!dig.userdata.is_alive) {
    //is not alive
    const h_gap = parseInt(
      (new Date(dig.userdata.backDate).getTime() - new Date().getTime()) / 1000
    );
    if (h_gap > 0 || !SETT_CMD.kira.comebackBy.check.all.if) {
      //can not be bring back
      return {
        method: "PATCH",
        body: {
          content: translate(dig.lang, "check.alive.not", {
            time: time_format_string_from_int(h_gap, dig.lang),
          }),
        },
      };
    }

    //bring back
    await kira_user_set_life(dig.userdata.id, true);

    //message
    if (SETT_CMD.kira.comebackBy.check.all.message) {
      //open DM
      const dm_id = await DiscordUserOpenDm(dig.userdata.userId);
      //send message
      try {
        //var h_victim_message =
        await DiscordRequest(`channels/${dm_id}/messages`, {
          method: "POST",
          body: {
            content: translate(dig.lang, "cmd.comeback.check.all"),
          },
        });
      } catch (e) {
        let errorMsg = JSON.parse(e.message);
        if (!(errorMsg?.code === 50007)) throw e;
      }
    }
  }
  //gud
  return undefined;
}

//"book" check
function check_has_book(dig) {
  if (!dig.userbook) {
    return {
      method: "PATCH",
      body: {
        content: translate(dig.lang, "check.hasbook.not"),
      },
    };
  }
  return undefined;
}

async function check_has_noDrop(dig) {
  const h_gap = await kira_user_get_drop(dig.userdata.id);
  if (h_gap > 0) {
    return {
      method: "PATCH",
      body: {
        content: translate(dig.lang, "check.nodrop.not", {
          time: time_format_string_from_int(h_gap, dig.lang),
        }),
      },
    };
  }
  return undefined;
}

//react check
function check_react_is_self(dig) {
  console.log(
    `check : check_react_is_self IM=${dig.message?.interaction?.user.id} I=${dig.message?.interaction_metadata?.user.id}`
  );
  if (
    dig.type === InteractionType.MESSAGE_COMPONENT &&
    //dig.message.interaction_metadata.user.id !== dig.user.id
    dig.message.interaction.user.id !== dig.user.id
  ) {
    return {
      method: "PATCH",
      body: {
        content: translate(dig.lang, "check.react.self.not"),
      },
    };
  }
  return undefined;
}

//--- the commands ---

//#god command
async function cmd_god({ userdata, data, lang, locale }) {
  const arg_sub = data.options.find((opt) => opt.name === "action")?.value; // also data.options[0].value
  const arg_user = data.options.find((opt) => opt.name === "user")?.value;
  const arg_amount = data.options.find((opt) => opt.name === "amount")?.value;

  switch (arg_sub) {
    //#life subcommand (#revive & #kill)
    case "revive": {
    }
    case "kill":
      {
        if (!arg_user) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.life.fail.missing.user"),
            },
          };
        }

        const h_targetId = arg_user;
        const targetdata = await kira_user_get(h_targetId, false);

        if (!targetdata) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.life.fail.notplayer"),
            },
          };
        }

        const h_life = arg_sub === "revive";

        if (targetdata.is_alive === h_life) {
          return {
            method: "PATCH",
            body: {
              content: translate(
                lang,
                `cmd.god.life.fail.already.${h_life ? "alive" : "dead"}`,
                { targetId: h_targetId }
              ),
            },
          };
        }

        await kira_user_set_life(targetdata.id, h_life);

        return {
          method: "PATCH",
          body: {
            content: translate(
              lang,
              `cmd.god.life.done.${h_life ? "revive" : "kill"}`,
              { targetId: h_targetId }
            ),
          },
        };
      }
      break;

    //#drop subcommand
    case "drop":
      {
        if (!arg_user) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.life.fail.missing.user"),
            },
          };
        }

        if (arg_amount === null) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.drop.fail.missing.amount"),
            },
          };
        }

        const targetdata = await kira_user_get(arg_user, false);

        await kira_user_set_drop(targetdata.id, arg_amount);

        return {
          method: "PATCH",
          body: {
            content: translate(
              lang,
              "cmd.god.drop.done." + (arg_amount == 0 ? "zero" : "more"),
              {
                targetId: arg_user,
                time: time_format_string_from_int(arg_amount, lang),
              }
            ),
          },
        };
      }
      break;

    //#apple subcommand (#apple_fake & #apple_give)
    case "apple_fake": {
    }
    case "apple_give":
      {
        if (!arg_user) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.apple.fail.missing.user"),
            },
          };
        }

        const h_fake = !(arg_sub === "apple_give");

        if (!arg_amount) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.apple.fail.missing.amount"),
            },
          };
        }

        const h_targetId = arg_user;
        const targetdata = await kira_user_get(h_targetId, false);

        if (!targetdata) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.apple.fail.notplayer"),
            },
          };
        }

        const h_given = h_fake ? 0 : arg_amount;
        const h_identity = `${h_fake ? "fake" : "real"}.${
          h_given < 0 ? "remove" : "add"
        }`;

        kira_apple_claims_add(targetdata.id, {
          added: h_given,
          displayed: Math.abs(arg_amount),
          type: "admin." + h_identity,
        });

        return {
          method: "PATCH",
          body: {
            content: translate(lang, "cmd.god.apple.done." + h_identity, {
              targetId: h_targetId,
              displayed: Math.abs(arg_amount),
              word: translate(
                lang,
                `word.apple${Math.abs(arg_amount) > 1 ? "s" : ""}`
              ),
            }),
          },
        };
      }
      break;

    //#test subcommand
    case "test":
      {
        let r;

        if (false) {
          let glob;
          {
            let local = " me";
            glob = () => {
              return "im" + local;
            };
          }
          r = glob();
        }

        if (false) {
          const userDay = time_userday_get(locale);
          r = `${userDay} - ${time_day_int(userDay)} - ${time_day_format(
            userDay
          )}`;
        }

        if (false) {
          //const arg_user_data = await kira_user_get(arg_user, false);
          console.time("test:cost");
          const repeat = arg_amount ? arg_amount : 11;
          let r_som = 0;
          let r_all = [];
          for (let i = 0; i < repeat; i++) {
            const start = Date.now();
            //the operation to test

            await Achievement.list["outerTime"].do_check(
              userdata,
              10000000,
              lang,
              {},
              (it) => time_format_string_from_int(it, lang)
            );

            const end = Date.now();
            const gap_ms = end - start;
            r_som += gap_ms;
            r_all.push(gap_ms);
          }
          r_all.sort((a, b) => a - b);
          r = `operation repeated ${repeat} times.\ntotal=${Math.round(
            r_som
          )}ms  average=${Math.round(r_som / repeat)}ms  median=${Math.round(
            r_all[Math.floor(repeat / 2)]
          )}ms  min=${Math.round(r_all[0])}ms  max=${Math.round(
            r_all[repeat - 1]
          )}ms`;
          console.log(` cmd : perf tester`, r);
          console.timeEnd("test:cost");
        }

        {
          r = Achievement.list["counter"].level_graduate(arg_amount);
        }

        return {
          method: "PATCH",
          body: {
            content:
              translate(lang, "cmd.god.test.done") + (r ? " `" + r + "`" : ""),
          },
        };
      }
      break;

    //#update subcommand
    case "update":
      {
        if (!arg_user) {
          await kira_do_refreshCommands();
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.update.done.commands"),
            },
          };
        }

        const targetdata = await kira_user_get(arg_user, false);

        if (!targetdata) {
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.god.update.fail.notplayer"),
            },
          };
        }

        {
          console.time("checkup");
          console.log(` cmd : checkup user id=${arg_user}`);
          await stats_checkup(targetdata);
          console.timeEnd("checkup");
        }

        return {
          method: "PATCH",
          body: {
            embeds: [
              {
                color: 255 * 256,
                description: translate(lang, "cmd.god.update.done.user", {
                  targetId: arg_user,
                }),
              },
            ],
          },
        };
      }
      break;

    default:
      {
        return {
          method: "PATCH",
          body: {
            content: kira_error_msg(
              "error.point.404",
              { message: `unknow god action [${data.options[0].value}]` },
              lang
            ),
          },
        };
      }
      break;
  }
}

//#feedback command
async function cmd_feedback({ data, userdata, lang, user }) {

  //is the command alone
  if (!data.options) {

    //PATCH confirmation
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.feedback.confirm"),
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `makecmd feedback_form true`,
                label: translate(lang, "cmd.feedback.confirm.yes"),
                emoji: sett_emoji_feedback_confirm,
                style:ButtonStyleTypes.PRIMARY,
                //style:ButtonStyleTypes.SECONDARY,
                disabled: false,
              },
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `makecmd feedback_form false`,
                label: translate(lang, "cmd.feedback.confirm.no"),
                //emoji: {name: "" },
                style:ButtonStyleTypes.SECONDARY,
                disabled: false,
              }
            ]
          }
        ]
      }
    }
  }
  
  const letter = data.options.find((opt) => opt.name==='letter').value;
  const last = data.options.find((opt) => opt.name==='last').value;

  //POST to admin webhook
  //the hardcoded admin webhook
  //https://discord.com/api/webhooks/1310027255803805707/OcrwX3OV7EmBfMpTD21Pg3dbprv0eUX8nFBtYxdVceiCqvgnu-ru9Z5GN6O2MLkkhMPY
  await DiscordRequest(
    SETT_CMD.feedback.mailboxWebhook,
  {
    method: "POST",
    body: {
      //content: " ",
      embeds: [{
        title: translate(lang, "cmd.feedback.post.title", { userId: user.id }),
        description: translate(lang, "cmd.feedback.post.in", { letter, userId: user.id }),
        fields: [],
        author: {
          name: translate(lang, "cmd.feedback.post.author", {userId: user.id, userName: user.username, userDataId: userdata.id }),
          icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=1024&format=webp&width=640&height=640`
        },
        color: user.accent_color,
        footer: (last) ? {
          text: translate(lang, "cmd.feedback.post.last", {last})
        } : null
      }]
    },
  });

  return {
    method: "PATCH",
    body: {
      content: translate(
        lang,
        "cmd.feedback.done",
        { letter, last },
      ),
    },
  };
}

async function cmd_feedback_form({ data, message, lang, token, id }) {

  //its no button
  if (!data.options[0].value) 
  {
    //remove the message
    await DiscordRequest(
      `webhooks/${process.env.APP_ID}/${token}/messages/@original`,
      {
        method: "DELETE",
      }
    );
    return;//! return nothing
  }

  //call the form
  
  //POST input modal
  {
    await DiscordRequest(
      `interactions/${id}/${token}/callback`, {
      method: "POST",
      body: {
        type: InteractionResponseType.MODAL,
        data: {
          title: translate(lang, "cmd.feedback.modal.title"),
          custom_id: `makecmd feedback`,
          components: [
            {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  style: TextStyleTypes.PARAGRAPH,
                  custom_id: `feedbackin`,
                  label: translate(lang, "cmd.feedback.modal.letter.label"),
                  placeholder: translate(lang, "cmd.feedback.modal.letter.placeholder"),
                  value: translate(lang, "cmd.feedback.modal.letter.value"),
                  required: true,
                  min_length: 13,
                  max_length: 666,
                }
              ]
            },
            {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                  type: MessageComponentTypes.INPUT_TEXT,
                  style: TextStyleTypes.SHORT,
                  custom_id: `feedbacklast`,
                  label: translate(lang, "cmd.feedback.modal.last.label"),
                  placeholder: translate(lang, "cmd.feedback.modal.last.placeholder"),
                  value: translate(lang, "cmd.feedback.modal.last.value"),
                  required: false,
                  min_length: 0,
                  max_length: 46,
                }
              ]
            }
          ]
        },
      },
    });
  }

  //remove buttons
  await DiscordRequest(
    `webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        components: [],
      },
    }
  );

  return;//! return nothing
  
  //send message
  if (false) {
    await DiscordRequest(
      `webhooks/${process.env.APP_ID}/${token}`,
    {
      method: "POST",
      body: {
        content: translate(lang, "cmd.feedback.writting"),
        /* didnt work
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
        },
        */
      }
    });
    return;
  }
};


//#claim command
async function cmd_claim({ userdata, data, userbook, lang }) {
  //variables
  let h_color = 0;
  let h_price = 0;
  if (data.options) {
    h_color = data.options[0].value;
    h_price = book_colors[h_color].price;
  }

  if (userbook) {
    return {
      method: "PATCH",
      body: {
        content: !h_price
          ? translate(lang, "cmd.claim.fail.already.free")
          : translate(lang, "cmd.claim.fail.already.paid", {
              price: h_price,
              color: translate(
                lang,
                `word.color.${book_colors[h_color].color}`
              ),
            }),
      },
    };
  }

  if (data.options) {
    if (h_price > 0) {
      let h_book_amount = await stats_simple_get(
        userdata.statPtr.id,
        "ever_book"
      );
      if (!h_book_amount > 0) {
        //cant pay your first death note
        return {
          method: "PATCH",
          body: {
            content: translate(lang, "cmd.claim.fail.color.young"),
          },
        };
      }

      if (data.options[1]) {
        //has clicked on the button
        if (userdata.apples < h_price) {
          //fail because too poor
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.claim.fail.color.poor"),
            },
          };
        } else {
          //pay to continue
          await kira_user_add_apple(userdata, h_price * -1);
        }
      } else {
        //send the button
        return {
          method: "PATCH",
          body: {
            content: translate(
              lang,
              `cmd.claim.confirm.color.${book_colors[h_color].color}`
            ),
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `makecmd claim ${h_color}+true`,
                    label: translate(lang, `cmd.claim.confirm.button`, {
                      price: h_price,
                    }),
                    emoji: sett_emoji_apple_croc,
                    style:
                      userdata.apples < h_price
                        ? ButtonStyleTypes.SECONDARY
                        : ButtonStyleTypes.SUCCESS,
                    disabled: false,
                  },
                ],
              },
            ],
          },
        };
      }
    }
  }

  await kira_book_create(userdata, h_color);
  await stats_simple_add(userdata.statPtr.id, "ever_book"); //+stats

  return {
    method: "PATCH",
    body: {
      content: translate(
        lang,
        `cmd.claim.done.${h_price === 0 ? "free" : "paid"}`,
        { emoji: book_colors[h_color].emoji }
      ),
    },
  };
}

//#burn command
async function cmd_burn({ message, type, data, userbook, userdata, lang, token }) {
  if (!userbook) {
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.burn.already"),
      },
    };
  }

  //confirmation message
  if (
    !(type === InteractionType.MESSAGE_COMPONENT) ||
    !data.options ||
    !message
  ) {
    //that not a message component interaction.
    await stats_simple_add(userdata.statPtr.id, "misc_match"); //+stats
    return {
      method: "PATCH",
      body: {
        content: translate(lang, `cmd.burn.confirm`),
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `makecmd burn true`,
                label: translate(lang, `cmd.burn.confirm.button.ok`),
                emoji: sett_emoji_burn_confirm,
                style: ButtonStyleTypes.DANGER,
                disabled: false,
              },
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: `makecmd burn false`,
                label: translate(lang, `cmd.burn.confirm.button.no`),
                style: ButtonStyleTypes.SECONDARY,
                disabled: false,
              },
            ],
          },
        ],
      },
    };
  }

  //if itself
  if (message.interaction.user.id !== userdata.userId) {
    return {
      method: "PATCH",
      body: {
        content: translate(lang, `cmd.burn.fail.notu`),
      },
    };
  }

  //remove buttons
  await DiscordRequest(
    `webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        components: [],
      },
    }
  );

  //if time
  {
    const h_gap = parseInt(
      (new Date().getTime() - new Date(message.timestamp).getTime()) / 1000
    );
    if (h_gap > 60) {
      return {
        method: "PATCH",
        body: {
          content: translate(lang, `cmd.burn.fail.expired`),
        },
      };
    }
  }

  //if cancel
  if (!data.options[0] || !data.options[0].value) {
    //remove components from the message
    //this does not works if know is used as a command
    return {
      method: "PATCH",
      body: {
        content: translate(lang, `cmd.burn.cancel`),
      },
    };
  }

  console.debug(`cmd : burn userbook=`, userbook);
  //throw new Error("you would have burned it with sucress.");
  await kira_book_delete(userbook);

  return {
    method: "PATCH",
    body: {
      content: translate(lang, "cmd.burn.done"),
    },
  };
}

//#apples command
async function cmd_apple({ userdata, locale, lang }) {
  let h_apples_claimed = 0;
  let h_txt_claims = "";
  let h_txt_more = "";

  const droped = (await kira_user_get_drop(userdata.id)) > 0;
  if (droped && userdata.apples >= 10)
    h_txt_more = "\n" + translate(lang, `cmd.apples.get.why`);

  //claims
  {
    //claims/daily
    {
      const h_dayGap = time_day_gap(
        await kira_user_get_daily(userdata.id),
        locale,
        true
      );
      const h_dayGapDiff = h_dayGap.now.day - h_dayGap.last.day;

      if (h_dayGapDiff != 0) {
        //claim you daily
        await kira_user_set_daily(userdata.id);
        h_apples_claimed += SETT_CMD.apple.dailyAmount;
        h_txt_claims +=
          translate(lang, `cmd.apples.claim.daily`, { added: 1 }) + "\n";
        {
          //+stats
          const stat =
            h_dayGapDiff === 1
              ? await stats_simple_add(userdata.statPtr.id, "streak_appleDay")
              : await stats_simple_set(
                  userdata.statPtr.id,
                  "streak_appleDay",
                  0
                );
          //await Achievement.list["appleDailyStreak"].do_check(userdata, stat, lang);
        }
      }
    }

    //claims/others
    const h_claims = await kira_apple_claims_get(userdata.id);
    await kira_apple_claims_set(userdata.id, []);

    if (h_claims.length > 0) {
      for (let i = 0; i < h_claims.length; i++) {
        h_txt_claims +=
          translate(lang, `cmd.apples.claim.${h_claims[i].type}`, h_claims[i]) +
          "\n";
        h_apples_claimed += h_claims[i].added;
      }
    }

    await kira_user_add_apple(userdata, h_apples_claimed);
    await stats_simple_add(userdata.statPtr.id, "ever_apple", h_apples_claimed); //+stats
  }

  return {
    method: "PATCH",
    body: {
      content:
        h_txt_claims +
        translate(
          lang,
          `cmd.apples.get.${h_apples_claimed > 0 ? "changed" : "same"}`,
          {
            added: 1,
            amount: userdata.apples + h_apples_claimed,
            word: translate(
              lang,
              `word.apple${userdata.apples + h_apples_claimed > 1 ? "s" : ""}`
            ),
            emoji: kira_format_applemoji(userdata.apples + h_apples_claimed),
          }
        ) +
        h_txt_more,
    },
  };
}

//#top command
async function cmd_top({ data, userdata, userbook, lang }) {
  const h_on = data.options[0].value;
  //get
  let h_ranks;
  let h_amountK;
  let if_parse = false;
  switch (h_on) {
    case "apple":
      {
        if_parse = false;
        h_ranks = await kira_users_rank("apples");
        h_amountK = "apples";
      }
      break;
    case "kill":
      {
        h_ranks = await stats_simple_rank("do_kill");
        h_amountK = "do_kill";
      }
      break;
    case "murder":
      {
        h_ranks = await stats_simple_rank("do_hit");
        h_amountK = "do_hit";
      }
      break;
    case "time":
      {
        if_parse = true;
        h_ranks = await stats_simple_rank("do_outerTime");
        h_amountK = "do_outerTime";
      }
      break;
  }

  //formating
  {
    let ifSelfOn = false;
    let h_txt = "";

    let h_nl = "";
    for (let i = 0; i < 3; i++) {
      let h_amount = h_ranks[i][h_amountK];
      if (if_parse) h_amount = stats_parse(h_amountK, h_amount, lang);
      if (h_ranks[i].userId === userdata.userId) ifSelfOn = true;
      h_txt +=
        h_nl +
        translate(lang, `cmd.top.get.${h_on}.place`, {
          rank: i + 1,
          playerId: h_ranks[i].userId,
          amount: h_amount,
        });
      h_nl = "\n";
    }

    {
      //+stat
      if (ifSelfOn) {
        await Achievement.list["onLeaderboard"].do_grant(userdata, lang, 1, {
          name: translate(lang, `cmd.top.get.${h_on}.name`),
        });
      }
    }

    return {
      method: "PATCH",
      body: {
        content: translate(lang, `cmd.top.get.${h_on}.title`),
        embeds: [
          {
            color: book_colors[userbook.color].int,
            description: h_txt,
          },
        ],
      },
    };
  }
}

//#stats command
async function cmd_stats({ data, userdata, userbook, lang }) {
  let r_text;
  let r_lore = "";

  switch (data.options[0].value) {
    case "broad":
      {
        for (const k of stats_order_broad) {
          const value = await stats_simple_get(userdata.statPtr.id, k);
          //if (!stats_simple_is_default(k, value))
          if (value && !stats_simple_is_default(k, value)) {
            r_lore = `${r_lore}\n${translate(lang, `stat.broad.show.${k}`, {
              value: stats_parse(k, value, lang),
            })}`;
          }
        }
        if (r_lore === "") {
          r_text = translate(lang, `stats.broad.fail.nothing`);
        } else {
          r_text = translate(lang, `stats.broad.show`);
        }
      }
      break;

    case "relation":
      {
        const pairs = await stats_pairs_get_all(userdata.userId);
        if (pairs.length > 0) {
          r_text = translate(lang, `stats.relation.show`);
          for (const v of pairs) {
            const pair_datas = await stats_pair_get_multiples(v, {
              by_hit: 3,
              userId: 2,
            });
            const hits = [pair_datas[0]["by_hit"], pair_datas[1]["by_hit"]];

            if (pair_datas[1]["userId"] === userdata.userId) {
              //suscide message

              if (hits[0] > 0) {
                r_lore = `${r_lore}\n${translate(lang, `stats.relation.self`, {
                  whoId: userdata.userId,
                  value: hits[0],
                  unit: translate(lang, `word.time${hits[0] > 1 ? "s" : ""}`),
                })}`;
              }
            } else {
              if (hits[0] > 0) {
                //you killed message
                r_lore = `${r_lore}\n${translate(
                  lang,
                  `stats.relation.person.u`,
                  {
                    whoId: pair_datas[1]["userId"],
                    value: hits[0],
                    unit: translate(lang, `word.time${hits[0] > 1 ? "s" : ""}`),
                  }
                )}`;
              }
              if (hits[1] > 0) {
                //killed you message
                r_lore = `${r_lore}\n${translate(
                  lang,
                  `stats.relation.person.e`,
                  {
                    whoId: pair_datas[1]["userId"],
                    value: hits[1],
                    unit: translate(lang, `word.time${hits[1] > 1 ? "s" : ""}`),
                  }
                )}`;
              }
            }
          }
        } else {
          r_text = translate(lang, `stats.relation.fail.nothing`);
        }
      }
      break;

    case "ratio":
      {
        for (const ratioKey in stats_order_ratio) {
          const dividend = await stats_simple_get(
            userdata.statPtr.id,
            stats_order_ratio[ratioKey][0]
          );
          const divider = await stats_simple_get(
            userdata.statPtr.id,
            stats_order_ratio[ratioKey][1]
          );
          if (
            !stats_simple_is_default(
              stats_order_ratio[ratioKey][0],
              dividend
            ) &&
            !stats_simple_is_default(stats_order_ratio[ratioKey][1], divider)
          ) {
            r_lore = `${r_lore}\n${translate(
              lang,
              `stat.ratio.show.${ratioKey}`,
              {
                value: Math.round((dividend / divider) * 1000) / 1000,
                dividend: dividend,
                divider: divider,
                //dividend: stats_parse(stats_order_ratio[ratioKey][0], dividend, lang),
                //divider: stats_parse(stats_order_ratio[ratioKey][1], divider, lang)
              }
            )}`;
          }
        }
        if (r_lore === "") {
          r_text = translate(lang, `stats.ratio.fail.nothing`);
        } else {
          r_text = translate(lang, `stats.ratio.show`);
        }
      }
      break;

    default:
      {
        return {
          method: "PATCH",
          body: {
            content: kira_error_msg(
              "error.point.404",
              { message: `unknow stats page [${data.options[0].value}]` },
              lang
            ),
          },
        };
      }
      break;
  }

  return {
    method: "PATCH",
    body: {
      content: r_text,
      embeds:
        r_lore === ""
          ? undefined
          : [
              {
                color: book_colors[userbook.color].int,
                description: r_lore,
              },
            ],
    },
  };
}

//#running
async function cmd_running({ userbook, user, lang }) {
  let h_runs_attacker = await kira_runs_by(undefined, user.id);

  let r_text;
  let r_lore = "";

  if (h_runs_attacker.length > 0) {
    r_text = translate(lang, `stats.running.show`);
    for (let v of h_runs_attacker) {
      const h_gap = parseInt(
        (new Date(v.finalDate).getTime() - new Date().getTime()) / 1000
      );
      r_lore += `\n${translate(lang, `stats.running.attacker`, {
        victimId: v.victimId,
        span: time_format_string_from_int(h_gap, lang),
      })}`;
    }
  } else {
    r_text = translate(lang, `stats.running.fail.nothing`);
  }

  return {
    method: "PATCH",
    body: {
      content: r_text,
      embeds:
        r_lore === ""
          ? undefined
          : [
              {
                color: book_colors[userbook.color].int,
                description: r_lore,
              },
            ],
    },
  };
}

//#quest
async function cmd_quest({ userdata, userbook, lang }) {
  return {
    method: "PATCH",
    body: await Achievement.display_get(
      userdata,
      book_colors[userbook.color].int,
      lang
    ),
  };
}

//#lang command
async function cmd_lang({ data, userdata, locale, lang }) {
  let r_txt;
  if (data.options) {
    let h_lang = data.options[0].value;
    if (h_lang === "mine") {
      let lore = lang_lore(locale);
      await lang_set(userdata.id, null);
      r_txt = translate(locale, "cmd.lang.your.set") + lore;
    } else {
      let lore = lang_lore(h_lang);
      await lang_set(userdata.id, h_lang);
      r_txt = translate(h_lang, "cmd.lang.define.set") + lore;
    }
  } else {
    let lore = lang_lore(lang);
    if (userdata.lang) r_txt = translate(lang, "cmd.lang.define.get") + lore;
    else r_txt = translate(lang, "cmd.lang.your.get") + lore;
  }

  return {
    method: "PATCH",
    body: {
      content: r_txt,
    },
  };
}

//#see command
async function cmd_see({ data, userbook, lang }) {
  //arg/page

  const h_lastPage = await kira_line_get_last_indexPage(userbook);
  let h_page = h_lastPage;
  if (data.options) h_page = data.options[0].value;

  if (!(await kira_line_if_pageGood(userbook, h_page - 1))) {
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.page.fail.none", { number: h_page }),
      },
    };
  }

  //page/make
  const h_lines = await kira_line_get_page(userbook, h_page - 1);
  let h_content = "";
  let t_delim = "";
  for (let i = 0; i < h_lines.length; i++) {
    if (h_lines[i]) h_content += t_delim + h_lines[i].line.markdown;
    else h_content += t_delim + "—————————————————————";
    t_delim = "\n";
  }

  return {
    method: "PATCH",
    body: {
      content: translate(lang, "cmd.page.get.up", { number: h_page }),
      embeds: [
        {
          color: book_colors[userbook.color].int,
          description: `${h_content}`,
          footer: {
            text: `${h_page} / ${h_lastPage}`,
          },
        },
      ],
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `makecmd see`,
              style: ButtonStyleTypes.SECONDARY,
              emoji: book_colors[userbook.color].emojiObj,
              disabled: false,
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `makecmd see ${h_page - 1}`,
              label: translate(lang, "cmd.page.get.left", { page: h_page - 1 }),
              style: ButtonStyleTypes.SECONDARY,
              disabled: !(await kira_line_if_pageGood(userbook, h_page - 2)),
            },
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `makecmd see ${h_page + 1}`,
              label: translate(lang, "cmd.page.get.right", {
                page: h_page + 1,
              }),
              style: ButtonStyleTypes.SECONDARY,
              disabled: !(await kira_line_if_pageGood(userbook, h_page)),
            },
          ],
        },
      ],
    },
  };
}

//#drop command
async function cmd_drop({ data, token, userdata, lang }) {
  //take confirmation
  let h_span = 0;
  let h_price = 0;
  if (data.options) {
    h_span = sett_catalog_drops[data.options[0].value].span;
    h_price = sett_catalog_drops[data.options[0].value].price;
  }

  //is the command alone
  else {
    //send
    {
      return {
        method: "PATCH",
        body: {
          content: translate(lang, "cmd.drop.shop"),
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: `makecmd drop <value>`, //"<value>" will be replaced with "value:" from button selected
                  placeholder: translate(lang, "cmd.drop.shop.sentence"),
                  options: (() => {
                    let buttons = [];
                    for (let i in sett_catalog_drops) {
                      const v = sett_catalog_drops[i]
                      buttons.push({
                        value: String(i),
                        emoji: sett_emoji_apple_croc,
                        label: translate(lang, `cmd.drop.shop.button.label`, {
                          price: v.price,
                          time: time_format_string_from_int(
                            v.span,
                            lang
                          ),
                          unit: translate(
                            lang,
                            `word.apple${v.price > 1 ? "s" : ""}`
                          ),
                        }),
                        description:
                          userdata.apples < v.price
                            ? translate(lang, `cmd.drop.shop.button.poor`)
                            : null,
                      });
                    }
                    return buttons;
                  })(),
                },
              ],
            },
          ],
        },
      };
    }
  }

  //is confirmed
  {
    //price gud?
    if (h_price > 0) {
      //if (data.options[1])
      {
        //has clicked on the button
        if (userdata.apples < h_price) {
          //fail because too poor
          return {
            method: "PATCH",
            body: {
              content: translate(lang, "cmd.drop.fail.poor"),
            },
          };
        } else {
          //pay before continue
          await kira_user_add_apple(userdata, -1 * h_price);
        }
      }
    }
  }
  //alles kla

  //set
  await kira_user_set_drop(userdata.id, h_span);

  //remove components from the message
  //this does not works if drop is used as a command
  await DiscordRequest(
    `webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        components: [],
      },
    }
  );

  //send confirmation
  {
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.drop.done", {
          time: time_format_string_from_int(h_span, lang),
        }),
      },
    };
  }
}

//#kira command
async function cmd_kira({
  data,
  locale,
  user,
  guild,
  userdata,
  userbook,
  channel,
  lang,
  token,
}) {
  //arg/victim
  const h_victim_id = data.options[0].value;
  let h_victim = await DiscordUserById(h_victim_id);
  //if (h_victim.global_name)
  let h_victim_name = h_victim.username;

  //arg/reason
  let h_txt_reason = data.options.find((opt) => opt.name === "reason");
  if (h_txt_reason) h_txt_reason = h_txt_reason.value;
  if (!h_txt_reason) h_txt_reason = translate(lang, `format.default.death`);

  //arg/span
  let h_span = data.options.find((opt) => opt.name === "span");
  if (h_span) h_span = h_span.value;
  if (!h_span) h_span = 40;

  //checks/first
  let h_will_ping_attacker = true;
  let h_will_ping_victim = true;
  let h_will_fail = false;

  if (h_victim.id === process.env.APP_ID) {
    //will fail because god of death
    h_will_ping_victim = false;
    h_will_fail = true;
  } else if (h_victim.bot || h_victim.system) {
    //instant fail because bot
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.kira.fail.bot"),
      },
    };
  }

  if (h_victim.id === user.id) {
    //will fail because urself
    h_will_ping_attacker = false;

    if (SETT_CMD.kira.noSuscide) {
      //instant fail because suicide disabled
      await Achievement.list["killU"].do_grant(userdata, lang);
      return {
        method: "PATCH",
        body: {
          content: translate(lang, "cmd.kira.fail.suicide"),
        },
      };
    }
  }

  if (!guild) {
    //instant fail because victim not here
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.kira.fail.channel"),
      },
    };
  }

  try {
    let user = await DiscordRequest(
      `/guilds/${guild.id}/members/${h_victim_id}`,
      //`/users/${h_victim_id}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());
  } catch (error) {
    console.debug(`kira : catch cant acess to user : ${error}`);
    if (JSON.parse(error.message)?.code === 10007) {
      //instant fail because victim not here
      return {
        method: "PATCH",
        body: {
          content: translate(lang, "cmd.kira.fail.blind", {
            victimId: h_victim_id,
          }),
        },
      };
    }
    throw error;
  }

  let h_victim_data = await kira_user_get(h_victim_id, !h_will_fail); //needed to know if alive

  if (!h_will_fail) {
    const h_gap = await kira_user_get_drop(h_victim_data.id);
    if (h_gap > 0) {
      return {
        method: "PATCH",
        body: {
          content: translate(lang, "cmd.kira.fail.droped", {
            time: time_format_string_from_int(h_gap, lang),
          }),
        },
      };
    }
  }

  //check/others runs
  let run_combo = 1;
  {
    //if attacker is not already killing victim
    let h_run_same = await kira_run_of(h_victim_id, user.id);
    if (h_run_same) {
      console.log(` kira : A already killing V : `, h_run_same);
      //if (new Date(h_run_same.finalDate) < new Date(h_now.getTime() + 610000))//!if sentance late of 10 second
      return {
        method: "PATCH",
        body: {
          content: translate(lang, "cmd.kira.fail.edit"),
        },
      };
    }
  }

  {
    //if victim is not already killing attacker
    let h_run_reverse = await kira_run_of(user.id, h_victim_id);
    if (h_run_reverse) {
      console.log(` kira : V already killing A : `, h_run_reverse);
      run_combo = h_run_reverse.counterCombo + 1;

      if (run_combo >= SETT_CMD.kira.counterMax) {
        // too much combo
        console.log(` kira : counter is max combo=`, run_combo);
        {
          //+achiv
          await Achievement.list["counterMax"].do_grant(userdata, lang, 1, {
            personId: h_victim_id,
          });
        }
        return {
          method: "PATCH",
          body: {
            content: translate(lang, "cmd.kira.fail.maxcombo", {
              max: SETT_CMD.kira.counterMax,
            }),
          },
        };
      }

      //cancel death if itself
      console.log(` kira : countering... comobo=`, run_combo);
      await cmd_kira_cancel({ runId: h_run_reverse.id });
      console.log(` kira : countered`);
      {
        //+stats
        const h_pair = await stats_pair_get_id(
          userdata.id,
          user.id,
          h_victim_data.id,
          h_victim_data.userId
        );
        //simpler pair
        {
          const stat = await stats_simple_add(
            userdata.statPtr.id,
            "do_counter"
          );
          await Achievement.list["counter"].do_check(userdata, stat, lang);
        }
        await stats_simple_add(h_victim_data.statPtr.id, "is_countered");
        await stats_pair_add(h_pair, "by_counter", 1); //return the value

        {
          //+achiv
          const h_gap = parseInt(
            (new Date(userdata.finalDate).getTime() - new Date().getTime()) /
              1000
          );
          console.debug(
            `kira : countershort gap=${
              userdata.finalDate
            } - ${new Date()} = ${h_gap}`
          );
          if (h_gap < 6) {
            await Achievement.list["counterShort"].do_grant(userdata, lang, {
              time: time_format_string_from_int(lang, "cmd.kira.fail.maxcombo"),
            });
          }
        }
      }
      //and continue
    }
  }

  if (
    !h_will_fail && // if will fail = possibily no victim_data
    !h_victim_data.is_alive
  ) {
    //instant fail because is dead
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.kira.fail.isdead"),
      },
    };
  }

  //line
  let h_txt_span = time_format_string_from_int(h_span, lang);
  const h_line = translate(lang, "format.line", {
    victim: h_victim_name,
    reason: h_txt_reason,
    time: h_txt_span,
  });

  if (h_line.length > 256 && !userdata.is_god) {
    //54*3 : 3 less than lines
    //fail bcs too long
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.kira.fail.text.max"),
      },
    };
  }

  //checked !

  //validate writting
  const h_dayGap = time_day_gap(userbook.updatedAt, locale, true, true);
  const h_dayGapDiff = h_dayGap.now.day - h_dayGap.last.day;
  const h_note = await kira_line_append(userbook, h_line, h_dayGap);
  console.debug(
    `kira : h_dayGapDiff=${h_dayGapDiff}=${locale}-${userbook.updatedAt}`
  );

  {
    //+stats
    await stats_simple_add(userdata.statPtr.id, "do_try");
    if (h_victim_data?.id)
      await stats_simple_add(h_victim_data?.statPtr.id, "is_tried");

    if (h_dayGapDiff != 0) {
      //not the same day
      const stat =
        h_dayGapDiff === 1
          ? await stats_simple_add(userdata.statPtr.id, "streak_killDay")
          : await stats_simple_set(userdata.statPtr.id, "streak_killDay", 0);
      if (h_dayGapDiff === 1)
        await Achievement.list["killDailyStreak"].do_check(
          userdata,
          stat,
          lang
        );
      if (h_dayGapDiff >= 13)
        await Achievement.list["killDailyComeback"].do_grant(
          userdata,
          lang,
          1,
          { gap: h_dayGapDiff }
        );
    }

    if ((userbook.index + 1) % SETT_CMD.see.maxLines === 0) {
      const stat = await stats_simple_add(
        userdata.statPtr.id,
        "streak_pageFilled"
      );
      await Achievement.list["writtenPage"].do_check(userdata, stat, lang);
    }
  }

  //creat kira run
  let h_finalDate = new Date();
  h_finalDate.setSeconds(h_finalDate.getSeconds() + h_span);
  const h_run = await kira_run_create(
    h_finalDate,
    user.id,
    h_victim_id,
    h_victim_data?.id,
    run_combo
  );
  kira_remember_task_add(h_finalDate, tasksType.KIRA, { runId: h_run.id });

  var h_all_msg = translate(lang, "cmd.kira.start.guild", {
    attackerId: user.id,
    line: h_line,
  });

  //message/victim
  if (h_will_ping_victim) {
    try {
      //open DM
      var h_victim_dm_id = await DiscordUserOpenDm(h_victim_id);

      //send message
      var h_victim_message = await DiscordRequest(
        `channels/${h_victim_dm_id}/messages`,
        {
          method: "POST",
          body: {
            content: translate(lang, "cmd.kira.start.mp.victim", {
              time: h_txt_span,
            }),
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: (() => {
                  let buttons = [];
                  for (let i in sett_catalog_knows) {
                    if (sett_catalog_knows[i].for === KnowUsableBy.VICTIM)
                      buttons.push({
                        type: MessageComponentTypes.BUTTON,
                        custom_id: `makecmd know ${i}+${h_run.id}`,
                        label: translate(
                          lang,
                          `cmd.kira.start.mp.victim.pay.${i}`,
                          { price: sett_catalog_knows[i].price }
                        ),
                        emoji: sett_emoji_apple_croc,
                        style:
                          userdata.apples < sett_catalog_knows[i].price
                            ? ButtonStyleTypes.SECONDARY
                            : ButtonStyleTypes.SUCCESS,
                        disabled: false,
                      });
                  }
                  return buttons;
                })(),
              },
            ],
          },
        }
      ).then((res) => res.json());
    } catch (e) {
      let errorMsg = JSON.parse(e.message);
      if (errorMsg?.code === 50007) {
        h_all_msg +=
          "\n" + translate(lang, "cmd.kira.warn.nomp", { userId: h_victim_id });
        h_will_ping_victim = false;
      } else throw e;
    }
  }

  //message/attacker
  if (h_will_ping_attacker) {
    try {
      //open DM
      var h_attacker_dm_id = await DiscordUserOpenDm(user.id);

      //send message
      var h_attacker_message = await DiscordRequest(
        `channels/${h_attacker_dm_id}/messages`,
        {
          method: "POST",
          body: {
            content: translate(lang, "cmd.kira.start.mp.attacker", {
              victimId: h_victim.id,
              time: h_txt_span,
            }),
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: (() => {
                  let buttons = [];
                  for (let i in sett_catalog_knows) {
                    if (sett_catalog_knows[i].for === KnowUsableBy.ATTACKER)
                      buttons.push({
                        type: MessageComponentTypes.BUTTON,
                        custom_id: `makecmd know ${i}+${h_run.id}`,
                        label: translate(
                          lang,
                          `cmd.kira.start.mp.attacker.pay.${i}`,
                          { price: sett_catalog_knows[i].price }
                        ),
                        emoji: sett_emoji_apple_croc,
                        style:
                          userdata.apples < sett_catalog_knows[i].price
                            ? ButtonStyleTypes.SECONDARY
                            : ButtonStyleTypes.SUCCESS,
                        disabled: false,
                      });
                  }
                  return buttons;
                })(),
              },
            ],
          },
        }
      ).then((res) => res.json());
    } catch (e) {
      let errorMsg = JSON.parse(e.message);
      if (errorMsg?.code === 50007) {
        h_all_msg +=
          "\n" + translate(lang, "cmd.kira.warn.nomp", { userId: user.id });
        h_will_ping_attacker = false;
      } else throw e;
    }
  }

  //packing before wait
  await kira_run_pack(
    h_run.id,
    {
      //used to execute
      txt_reason: h_txt_reason,
      span: h_span,
      note_id: h_note.id,

      lang: lang,

      will_ping_victim: h_will_ping_victim,
      will_ping_attacker: h_will_ping_attacker,
      will_fail: h_will_fail,

      victim_id: h_victim.id,
      victim_data_id: h_victim_data?.id, // is possibly undefined (when [will_fail])
      victim_username: h_victim_name,
      victim_dm_id: h_victim_dm_id, //can be undefined
      victim_message_id: h_victim_message?.id, //can be undefined
      attacker_id: user.id,
      // attacker_data_id: ?,
      attacker_dm_id: h_attacker_dm_id, //can be undefined
      attacker_message_id: h_attacker_message?.id, //can be undefined
      attacker_book_id: userbook.id,
    },
    {
      //used to know
      attacker_id: user.id,
      attacker_name: user.username,
      guild_id: channel.guild_id,
      channel_id: channel.id,
      channel_name: channel.name,
      message_id: channel.id,
      the_token: token,
    }
  );

  //message/all
  return {
    method: "PATCH",
    body: {
      content: h_all_msg,
    },
  };

  //pretty old method
  //setTimeout(() => { cmd_kira_execute({ data, user, lang }); }, h_span * 1000);
  s;
}

//is executed by [./remember.js]
export async function cmd_kira_execute(data) {
  //if (!data.run)
  console.log(` kira : EXECUTE. runId=${data.runId}`);

  //run reading
  if (!data.runId) {
    console.error(`kira : runId not defined. data=`, data);
    return;
  }
  const pack = await kira_run_unpack_execute(data.runId);
  if (!pack) {
    console.error(`kira : run deleted. data=`, data);
    //await kira_run_delete(data.runId);
    return;
  }

  //datas reading again
  const user = await DiscordUserById(pack.attacker_id); //!
  const lang = pack.lang; //!
  const h_victim_data = await kira_user_get(pack.victim_id, !pack.will_fail); //needed to know if alive
  const userdata = await kira_user_get(user.id, true);
  const h_attacker_book = await kira_book_get(userdata.id);
  //handle special case : burned book
  const h_will_book =
    h_attacker_book && h_attacker_book.id === pack.attacker_book_id;

  //run delete
  await kira_run_delete(data.runId, h_victim_data?.id);
  console.log(` kira : deleted. (runId=${data.runId})`);

  try {
    //message/victim/first/edit
    if (pack.will_ping_victim) {
      await DiscordRequest(
        `channels/${pack.victim_dm_id}/messages/${pack.victim_message_id}`,
        {
          method: "PATCH",
          body: {
            components: [],
          },
        }
      );
    }

    //message/attacker/first/edit
    if (pack.will_ping_attacker) {
      await DiscordRequest(
        `channels/${pack.attacker_dm_id}/messages/${pack.attacker_message_id}`,
        {
          method: "PATCH",
          body: {
            components: [],
          },
        }
      );
    }
  } catch (e) {
    let errorMsg = JSON.parse(e.message);
    if (!(errorMsg?.code === 50007)) throw e;
  }

  //check/second
  let h_return_msg_attacker = {
    message_reference: {
      message_id: pack.attacker_message_id,
    },
  };
  let h_return_msg_victim = {
    message_reference: {
      message_id: pack.victim_message_id,
    },
  };
  let stat_kill;
  let stat_avenge;
  let stat_repetition;
  let stat_outerTime;

  //date
  let h_finalDate = new Date();
  h_finalDate.setSeconds(h_finalDate.getSeconds() + pack.span);

  if (pack.victim_id === process.env.APP_ID) {
    //fail/god
    h_return_msg_attacker.content = translate(lang, "cmd.kira.fail.shini");
  } else if (!h_victim_data) {
    //will never happend
    h_return_msg_attacker.content = translate(lang, "cmd.kira.fail.notplayer");
  } else if (SETT_CMD.kira.cancelWhenDeadVictim && !h_victim_data.is_alive) {
    h_return_msg_attacker.content = translate(
      lang,
      "cmd.kira.fail.victim.dead.attacker"
    );
    h_return_msg_victim.content = translate(
      lang,
      "cmd.kira.fail.victim.dead.victim"
    );
  } else if (SETT_CMD.kira.cancelWhenDeadAttacker && !userdata.is_alive) {
    h_return_msg_attacker.content = translate(
      lang,
      "cmd.kira.fail.attacker.dead.attacker"
    );
    h_return_msg_victim.content = translate(
      lang,
      "cmd.kira.fail.attacker.dead.victim"
    );
  }

  //kill
  else {
    //sucess
    h_return_msg_attacker.content = translate(
      lang,
      "cmd.kira.finish.attacker",
      { victimId: pack.victim_id, reason: pack.txt_reason }
    );
    h_return_msg_victim.content = translate(lang, "cmd.kira.finish.victim", {
      reason: pack.txt_reason,
    });

    //kill
    {
      await kira_user_set_life(h_victim_data.id, false, h_finalDate);
      //revive
      kira_remember_task_add(h_finalDate, tasksType.REVIVE, {
        userId: pack.victim_id,
        lang: lang,
        ifSuicide: pack.victim_id == pack.attacker_id,
        msgReference: pack.victim_message_id,
      });
      if (h_will_book) await kira_line_taste(pack.note_id, 1); //note need to exist
    }

    {
      //+stats
      //simpler pair
      {
        const stat_bulk = await stats_simple_bulkadd(userdata.statPtr.id, {
          do_hit: 1,
          do_outerTime: pack.span,
        });
        stat_outerTime = stat_bulk["do_outerTime"];
      }
      await stats_simple_bulkadd(h_victim_data.statPtr.id, {
        is_hited: 1,
        is_outedTime: pack.span,
      });
    }
    //need to be out in this scope because used after
    let h_pair = await stats_pair_get_id(
      userdata.id,
      user.id,
      h_victim_data.id,
      pack.victim_id
    );
    stat_repetition = await stats_pair_add(h_pair, "by_hit", 1); //return the value

    if (stat_repetition === 1) {
      //first time attacker kill victim

      //monetize kill
      let h_victim_kills = await stats_simple_get(
        h_victim_data.statPtr.id,
        "do_kill"
      );
      console.log(
        "DBUG : kira : kills by victim for apples : ",
        h_victim_kills
      );

      {
        //+stats
        await stats_pair_set(h_pair, "by_avenge", h_victim_kills);
        {
          const stat_bulk = await stats_simple_bulkadd(userdata.statPtr.id, {
            do_kill: 1,
            do_avenger: h_victim_kills,
          });
          stat_kill = stat_bulk["do_kill"];
          stat_avenge = h_victim_kills;
        }
        await stats_simple_bulkadd(h_victim_data.statPtr.id, {
          is_killed: 1,
          is_avenged: h_victim_kills,
        });
      }

      let h_apples = 0; //default
      if (h_victim_kills) {
        h_apples = SETT_CMD.apple.avangerAppleReward(h_victim_kills);
        kira_apple_claims_add(userdata.id, {
          added: h_apples,
          type: "murderer",
          victim: pack.victim_username,
          attacker: user.username,
          kill: h_victim_kills,
        });
      } else {
        kira_apple_claims_add(userdata.id, {
          added: h_apples,
          type: "harmless",
          victim: pack.victim_username,
          attacker: user.username,
        });
      }
      h_return_msg_attacker.content +=
        "\n" +
        translate(lang, "cmd.kira.finish.attacker.first", {
          number: h_apples,
          unit: translate(lang, `word.apple${h_apples > 1 ? "s" : ""}`),
        });
    } else {
      h_return_msg_attacker.content +=
        "\n" +
        translate(lang, "cmd.kira.finish.attacker.count", {
          number: stat_repetition,
        });
    }
  }

  //send messages in last

  try {
    //message/victim/second
    if (pack.will_ping_victim) {
      await DiscordRequest(`channels/${pack.victim_dm_id}/messages`, {
        method: "POST",
        body: h_return_msg_victim,
      });
    }

    //message/attacker/second
    if (pack.will_ping_attacker) {
      await DiscordRequest(`channels/${pack.attacker_dm_id}/messages`, {
        method: "POST",
        body: h_return_msg_attacker,
      });
    }
  } catch (e) {
    let errorMsg = JSON.parse(e.message);
    if (!(errorMsg?.code === 50007)) throw e;
  }

  //+achievements
  {
    if (stat_kill) {
      //only if new kill
      await Achievement.list["kill"].do_check(userdata, stat_kill, lang);
      await Achievement.list["avengeBest"].do_check(
        userdata,
        stat_avenge,
        lang
      );
    }

    if (stat_outerTime) {
      await Achievement.list["outerTime"].do_check(
        userdata,
        stat_outerTime,
        lang,
        {},
        (it) => time_format_string_from_int(it, lang)
      );
    }

    if (pack.victim_id === process.env.APP_ID)
      await Achievement.list["killShini"].do_grant(userdata, lang);
    else if (pack.victim_id === pack.attacker_id)
      await Achievement.list["killU"].do_grant(userdata, lang);
    //only if not itself
    else {
      if (stat_repetition) {
        await Achievement.list["murdersOn"].do_check(
          userdata,
          stat_repetition,
          lang,
          { personId: pack.victim_id }
        );
      }

      if (pack.span === 1987200)
        await Achievement.list["outer23d"].do_grant(userdata, lang, 1, {
          personId: pack.victim_id,
        });
    }
  }
}

//is not executed by [./remember.js]
export async function cmd_kira_cancel(data) {
  console.log(` kira : CANCEL. runId=${data.runId}`);

  //run reading
  if (!data.runId) {
    console.error(`kira : runId not defined. data=`, data);
    return;
  }
  const pack = await kira_run_unpack_execute(data.runId);
  if (!pack) {
    console.error(`kira : run deleted. data=`, data);
    //await kira_run_delete(data.runId);
    return;
  }

  //datas reading again
  const user = DiscordUserById(pack.attacker_id); //!
  const lang = pack.lang; //!
  // let h_victim_data = await kira_user_get(pack.victim_id, !pack.will_fail);//needed to know if alive

  //run delete
  await kira_run_delete(data.runId, pack.victim_data_id);

  //message/victim/first/edit
  try {
    if (pack.will_ping_victim) {
      await DiscordRequest(
        `channels/${pack.victim_dm_id}/messages/${pack.victim_message_id}`,
        {
          method: "PATCH",
          body: {
            components: [],
          },
        }
      );
    }

    //message/attacker/first/edit
    if (pack.will_ping_attacker) {
      await DiscordRequest(
        `channels/${pack.attacker_dm_id}/messages/${pack.attacker_message_id}`,
        {
          method: "PATCH",
          body: {
            components: [],
          },
        }
      );
    }

    //message/victim/second
    if (pack.will_ping_victim) {
      await DiscordRequest(`channels/${pack.victim_dm_id}/messages`, {
        method: "POST",
        body: {
          message_reference: {
            message_id: pack.victim_message_id,
          },
          content: translate(lang, "cmd.kira.counter.victim", {
            victimId: pack.victim_id,
            attackerId: pack.attacker_id,
          }),
        },
      });
    }

    //message/attacker/second
    if (pack.will_ping_attacker) {
      await DiscordRequest(`channels/${pack.attacker_dm_id}/messages`, {
        method: "POST",
        body: {
          message_reference: {
            message_id: pack.attacker_message_id,
          },
          content: translate(lang, "cmd.kira.counter.attacker", {
            victimId: pack.victim_id,
            attackerId: pack.attacker_id,
          }),
        },
      });
    }
  } catch (e) {
    let errorMsg = JSON.parse(e.message);
    if (!(errorMsg?.code === 50007)) throw e;
  }
}

//is executed by [./remember.js]
export async function cmd_comeback(data) {
  const comeback_type = data.ifSuicide ? "suicide" : "other";

  //if comeback
  if (!SETT_CMD.kira.comebackBy.time[comeback_type].if) return;

  const userdata = await kira_user_get(data.userId, false);
  const lang = data.lang;

  const h_gap = parseInt(
    (new Date(userdata.backDate).getTime() - new Date().getTime()) / 1000
  );
  if (h_gap > 0) {
    //can not be bring back
    console.log(
      `cmd : comeback : cant bring back [${userdata.userId}] bcs gap=${h_gap}`
    );
    return;
  }

  //bring back
  console.log(`cmd : comeback : bringing back [${userdata.userId}]`);
  await kira_user_set_life(userdata.id, true);

  //if send message
  if (!SETT_CMD.kira.comebackBy.time[comeback_type].message) return;

  {
    //open DM
    const dm_id = await DiscordUserOpenDm(userdata.userId);

    //send message
    try {
      //var h_victim_message =
      await DiscordRequest(`channels/${dm_id}/messages`, {
        method: "POST",
        body: {
          message_reference: {
            message_id: data.msgReference,
          },
          content: translate(lang, "cmd.comeback.time." + comeback_type),
        },
      });
    } catch (e) {
      let errorMsg = JSON.parse(e.message);
      if (!(errorMsg?.code === 50007)) throw e;
    }
  }
}

//#know command
async function cmd_know({ data, message, userdata, lang }) {
  //args

  let h_wh = data.options[0].value;
  let h_id = data.options[1].value;

  //if is a fake one
  if (h_wh < 0) {
    //remove components from the message
    //this does not works if know is used as a command
    await DiscordRequest(
      `channels/${message.channel_id}/messages/${message.id}`,
      {
        method: "PATCH",
        body: {
          components: [],
        },
      }
    );

    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.know.fail.fake"),
      },
    };
  }

  const pack = await kira_run_unpack_know(h_id);

  //fail bcs too late
  if (!pack) {
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.know.fail.expired"),
      },
    };
  }

  const h_price = sett_catalog_knows[h_wh].price;

  //apples
  if (userdata.apples < h_price) {
    //if hasn't enougth
    return {
      method: "PATCH",
      body: {
        content: translate(lang, `cmd.know.fail.poor`, { price: h_price }),
      },
    };
  }
  await kira_user_add_apple(userdata, -1 * h_price);

  //wich info/action
  let h_info;
  if (h_wh === "who") {
    h_info = `${pack.attacker_name.charAt(0).toUpperCase()}`;
  } else if (h_wh === "where") {
    h_info = `${pack.channel_name}`;
  } else if (h_wh === "fullwho") {
    h_info = `<@${pack.attacker_id}>`;
  } else if (h_wh === "fullwhere") {
    //h_info = `<#${pack.guild_id}>`;//didnt work
    h_info = `<#${pack.channel_id}>`;
  } else if (h_wh === "delmsg") {
    //delete the message
    await DiscordRequest(
      `webhooks/${process.env.APP_ID}/${pack.the_token}/messages/@original`,
      {
        method: "DELETE",
      }
    );
  }

  //remove components from the message
  //this does not works if know is used as a command
  await DiscordRequest(
    `channels/${message.channel_id}/messages/${message.id}`,
    {
      method: "PATCH",
      body: {
        components: [],
      },
    }
  );

  //respond with a message
  //get the info
  return {
    method: "PATCH",
    body: {
      //content: `you are trying to know [${h_wh}] for id [${h_id}]`
      content: translate(lang, `cmd.know.get.${h_wh}`, {
        wh: h_info,
        price: h_price,
      }),
    },
  };
}

//#trick command
async function cmd_trick({ lang }) {
  //summon a new trick
  //is the command alone
  return {
    method: "PATCH",
    body: {
      content: translate(lang, "cmd.trick.shop"),
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: `makecmd <value>+0`, //"<value>" will be replaced with "value:" from button selected
              placeholder: translate(lang, "cmd.trick.shop.sentence"),
              options: (() => {
                let buttons = [];
                for (let i in tricks_all) {
                  let h_trick = tricks_all[i];

                  buttons.push({
                    value: `${
                      h_trick.ephemeral ? "trick_resp_eph" : "trick_resp"
                    } ${String(h_trick.name)}`,
                    emoji:
                      h_trick.price > 0
                        ? sett_emoji_apple_croc
                        : sett_emoji_apple_none,
                    label: translate(
                      lang,
                      `cmd.trick.item.${h_trick.name}.button.label`,
                      {
                        price: h_trick.price,
                        unit: translate(
                          lang,
                          `word.apple${h_trick.price > 1 ? "s" : ""}`
                        ),
                      }
                    ),
                    description: translate(
                      lang,
                      `cmd.trick.item.${h_trick.name}.button.desc`
                    ),
                  });
                }
                return buttons;
              })(),
            },
          ],
        },
      ],
    },
  };
}

async function cmd_trick_resp_eph({ data, message, userdata, token, lang }) {
  return await cmd_trick_resp({ data, message, userdata, token, lang });
}

async function cmd_trick_resp({ data, message, userdata, token, lang }) {
  //take confirmation
  if (!data.options) throw Error();

  //data.options
  //-[0] : trick id
  //-[1] : step index
  //  0 : first step
  //  -1 : second step
  //  ...
  //  -n : n+1 st step
  //  1 : payoff
  //-[2] : arguments pile
  //ALL of them have to be set
  const h_trick = tricks_all.find(
    (trick) => trick.name === data.options[0].value
  );
  const h_step = parseInt(data.options[1].value);
  const pile = data.options[2].value;

  //money check
  if (userdata.apples < h_trick.price) {
    //fail because too poor
    return {
      method: "PATCH",
      body: {
        content: translate(lang, "cmd.trick.fail.poor"),
      },
    };
  }

  //remove origin components
  if (message) {
    await DiscordRequest(
      `webhooks/${process.env.APP_ID}/${token}/messages/${message.id}`,
      {
        method: "PATCH",
        body: {
          components: [],
        },
      }
    );
  }

  //steps
  if (h_trick.do?.step && h_step <= 0) {
    if (h_step * -1 >= h_trick.do.step.length)
      throw Error(
        `step [${h_step}] of trick [${h_trick.name}] called but didnt exist.`
      );
    //call TRICK's STEP[i]
    const r_back = h_trick.do.step[h_step * -1]({
      data,
      message,
      userdata,
      lang,
      pile,
      token,
    });
    if (r_back) return r_back;
  }

  //pay
  await kira_user_add_apple(userdata, -1 * h_trick.price);

  //set
  //call TRICK's PAYOFF
  return h_trick.do.payoff({ data, message, userdata, lang, pile, token });
}
