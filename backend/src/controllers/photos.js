const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// add 
/**
 * 
 * @param {string} photo_path
 * @returns 
 */
exports.createPhoto = async ({ photo_path }) => {
  try {
    const [{ id: photoId }] = await knex("photos")
      .insert([{ photo_path }])
      .returning("id");
    return { photoId };
  }
  catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "something went wrong");
  }
};

// update 
exports.updatePhoto = async ({ photo_path }) => {
  try {
    const record = await knex("photos")
      .update({
        photo_path
      })
      .where({ id: photoId });

    return record;
  } catch (error) {
    console.log(error);
  }
};

// get by id 
exports.getPhotoById = async ({ photoId }) => {
  const [record] = await knex("photos")
    .select("id", "photo_path")
    .where({ id: photoId });

  return record;
};

// get list 
exports.listPhotoById = async (limit, offset) => {
  const [record] = await knex("photos")
    .select("*")
    .limit(limit)
    .offset(offset);

  return record;
};

// delete 
exports.deletePhoto = async ({ photoId }) => {
  const record = await knex("photos").select("id").where({ id: photoId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "photo has not been found");
  }

  await knex("photos").where({ id: orderId }).del();

  return { message: "photo is deleted" };
};
