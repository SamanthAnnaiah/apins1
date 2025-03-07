const zipsusa = require("../models/zipsusamodel");
const statecodesusa = require("../models/statecodesusa");

exports.searchLoad = async function (searchpin) {
  try {
    let sdata;
    if (isNaN(parseInt(searchpin))) {
      sdata = await zipsusa.aggregate([
        {
          $search: {
            index: "city_s1",
            text: {
              query: searchpin,
              path: "city",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 2,
              },
            },
          },
        },
        {
          $lookup: {
            from: "statecodesusa",
            localField: "state",
            foreignField: "state_code",
            as: "state_info",
          },
        },
        {
          $addFields: {
            state_name: { $arrayElemAt: ["$state_info.state_name", 0] },
          },
        },
        {
          $project: {
            _id: 0,
            city: 1,
            loc: 1,
            pop: 1,
            state: 1,
            cpin: 1,
            state_name: 1,
          },
        },
      ]);
    } else {
      sdata = await zipsusa.aggregate([
        {
          $match: { cpin: 1007 },
        },
        {
          $lookup: {
            from: "statecodesusa",
            localField: "state",
            foreignField: "state_code",
            as: "state_info",
          },
        },
        {
          $addFields: {
            state_name: { $arrayElemAt: ["$state_info.state_name", 0] },
          },
        },
        {
          $project: {
            _id: 0,
            city: 1,
            loc: 1,
            pop: 1,
            state: 1,
            cpin: 1,
            state_name: 1,
          },
        },
      ]);
    }

    if (!sdata || sdata.length === 0) {
      console.log(`No data found for: ${searchpin}`);
      return { success: false, data: null, error: "No data found" };
    }
    console.log("sdata", sdata);
    return { success: true, data: sdata, error: null };
  } catch (error) {
    console.error(`Error searching for ${searchpin}:`, error.message);
    return {
      success: false,
      data: null,
      error: `Failed to search database: ${error.message}`,
    };
  }
};

exports.searchLoad1 = async function (searchpin) {
  try {
    let sdata;
    if (isNaN(parseInt(searchpin))) {
      console.log("searchpin is not a number:", searchpin);
      sdata = await zipsusa.aggregate([
        {
          $search: {
            index: "city_s1",
            text: {
              query: searchpin,
              path: "city",
              fuzzy: {},
            },
          },
        },
      ]);
    } else {
      sdata = await zipsusa.find({ cpin: parseInt(searchpin) });
    }
    let sdata1 = await addStateName(sdata);
    console.log("sdata1 with addStateName:", sdata1);
    if (!sdata1 || sdata1.length === 0) {
      console.log(`No data found for: ${searchpin}`);
      return { success: false, data: null, error: "No data found" };
    }
    console.log("sdata1:", sdata1);
    return { success: true, data: sdata1, error: null };
  } catch (error) {
    console.error(`Error searching for ${searchpin}:`, error.message);
    return {
      success: false,
      data: null,
      error: `Failed to search database: ${error.message}`,
    };
  }
};

async function addStateName(sdata) {
  return Promise.all(
    sdata.map(async (zdata) => {
      const state_info = await statecodesusa.findOne({
        state_code: zdata.state,
      });
      const mstate = state_info?.state_name || "Unknown";
      // Check if zdata is a Mongoose document or plain object
      const baseData = zdata.toObject ? zdata.toObject() : zdata;
      return { ...baseData, state_name: mstate };
    })
  );
}
