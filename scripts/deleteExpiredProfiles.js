// const { Profile } = require("../models");
// const { Op } = require("sequelize");

// const deleteExpiredProfiles = async () => {
//   const cutoffDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);

//   const deleted = await Profile.destroy({
//     where: {
//       deleted_at: {
//         [Op.lt]: cutoffDate,
//       },
//     },
//   });

//   console.log(`Deleted ${deleted} expired profiles`);
// };

// deleteExpiredProfiles();
