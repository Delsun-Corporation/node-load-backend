const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const bodyPartsModel = require("../../models/body_parts.model");
const common_librariesModel = require("../../models/libraries/common_libraries.model");
const user_librariesModel = require("../../models/libraries/user_libraries.model");
const _ = require("lodash");

exports.postLibraryList = (req, res) => {
  const { authorization } = req.headers;
  const {
    user_id,
    status,
    search,
    is_group_wise,
    search_from,
    list,
    relation,
  } = req.body;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return bodyPartsModel.findOne({ code: status }, (err, category) => {
      if (err) {
        return res
          .status(500)
          .json(error("Cannot get body parts", res.statusCode));
      }

      if (!category) {
        return res.json(
          success("Success find body parts data", null, res.statusCode)
        );
      }

      const categoryId = category.id;

      return bodyPartsModel.find(
        { parent_id: categoryId },
        (err, body_parts) => {
          const sub_parent_ids = [];

          body_parts.forEach((element) => {
            sub_parent_ids.push(element.id);
          });

          return common_librariesModel.find(
            { sub_header_id: { $in: sub_parent_ids } },
            (err, common_libraries) => {
              if (err) {
                return res
                  .status(500)
                  .json(error("Cannot get common libraries", res.statusCode));
              }

              if (!common_libraries) {
                return res.json(
                  success("Success find body parts data", null, res.statusCode)
                );
              }

              // return user_librariesModel.findOne({})

              const searchKeyword =
                search == null || search == undefined || search == ""
                  ? ""
                  : search;

              body_parts.forEach((body) => {
                common_libraries.forEach((library) => {
                  if (
                    body.id == library.sub_header_id &&
                    library.exercise_name.includes(searchKeyword)
                  ) {
                    if (
                      library.regions_ids != null &&
                      library.regions_ids != undefined &&
                      library.regions_ids != ""
                    ) {
                      const splittedRegionsString =
                        library.regions_ids.split(/[, ]+/);
                      library._doc.regions_ids = splittedRegionsString;
                    }
                    if (
                      library.targeted_muscles_ids != null &&
                      library.targeted_muscles_ids != undefined &&
                      library.targeted_muscles_ids != ""
                    ) {
                      const splittedMusclesString =
                        library.targeted_muscles_ids.split(/[, ]+/);
                      library._doc.targeted_muscles_ids = splittedMusclesString;
                    }
                    if (
                      library.equipment_ids != null &&
                      library.equipment_ids != undefined &&
                      library.equipment_ids != ""
                    ) {
                      const splittedEquipmentsString =
                        library.equipment_ids.split(/[, ]+/);
                      library._doc.equipment_ids = splittedEquipmentsString;
                    }
                    if (
                      library.regions_secondary_ids != null &&
                      library.regions_secondary_ids != undefined &&
                      library.regions_secondary_ids != ""
                    ) {
                      const splittedregions_secondary_idsString =
                        library.regions_secondary_ids.split(/[, ]+/);
                      library._doc.regions_secondary_ids =
                        splittedregions_secondary_idsString;
                    }

                    body.data.push(library);
                  }
                });
              });

              return res.json(
                success(
                  "Scucces get library list",
                  { list: body_parts },
                  res.statusCode
                )
              );
            }
          );
        }
      );
    });
  });
};

exports.addFavouriteLibrary = (req, res) => {
  const library_id = req.params.libraryId;
  const { user_id, is_favorite } = req.body;
  const { authorization } = req.headers;

  if (library_id == null || library_id == undefined || library_id == "") {
    return res.status(403).json(error("Invalid request", res.statusCode));
  }

  authModel.findOne({ id: user_id }, (err, user) => {
    if (err || !user) {
      return res
        .status(500)
        .json(error("Can't find user with that id", res.statusCode));
    }

    if (user.token != authorization) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    return user_librariesModel.findOne({ user_id }, (err, user_library) => {
      if (err) {
        return res
          .status(500)
          .json(
            error("Error server while search for user library", res.statusCode)
          );
      }

      if (!user_library) {
        // Create new model
        var userLibrary = new user_librariesModel();

        var favorite_libraries = [];

        if (is_favorite) {
          favorite_libraries.push(library_id);
        }

        const updatedData = {
          user_id,
          favorite_libraries,
        };

        userLibrary = _.extend(userLibrary, updatedData);

        return userLibrary.save((err, result) => {
          if (err) {
            return res
              .status(500)
              .json(
                error(
                  "Error server while saving new user library",
                  res.statusCode
                )
              );
          }

          return res.json(
            success("Success add favorite library", null, res.statusCode)
          );
        });
      }

      var updateUserFavoriteLibraries = user_library.favorite_libraries;

      if (is_favorite) {
        // if is_favorite == true, then add to list
        updateUserFavoriteLibraries.push(library_id);
      } else {
        // if not, remove data from list if exist
        const index = updateUserFavoriteLibraries.indexOf(library_id);
        if (index > -1) { // only splice array when item is found
          updateUserFavoriteLibraries.splice(index, 1); // 2nd parameter means remove one item only
        }
      }

      const updatedData = {
        favorite_libraries: updateUserFavoriteLibraries,
      };

      user_library = _.extend(user_library, updatedData);

      return user_library.save((err, result) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Error server while saving new user library",
                res.statusCode
              )
            );
        }

        return res.json(
          success("Success add favorite library", null, res.statusCode)
        );
      });
    });
  });
};
