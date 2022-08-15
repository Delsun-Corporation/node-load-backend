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

    // If Favorite is called
    if (status == "FAVORITE") {
      return common_librariesModel.find({}, (err, common_library) => {
        if (err) {
          return res
            .status(500)
            .json(error("Cannot get common libraries", res.statusCode));
        }

        if (!common_library) {
          return res.json(
            success(
              "Success find body parts data",
              { list: [] },
              res.statusCode
            )
          );
        }
        return user_librariesModel.findOne(
          { user_id: id },
          (err, user_library) => {
            if (err) {
              return res
                .status(500)
                .json(
                  error(
                    "Error server while getting user library",
                    res.statusCode
                  )
                );
            }

            if (!user_library) {
              return res.json(
                success(
                  "No favorite libraries, please add one",
                  { list: [] },
                  res.statusCode
                )
              );
            }

            const savedCommonLibrariesDetail =
              user_library.saved_common_libraries_detail;
            if (
              savedCommonLibrariesDetail !== undefined &&
              savedCommonLibrariesDetail.length > 0
            ) {
              // Assign Personal Common Libraries Detail if exist
              common_library.forEach((part) => {
                savedCommonLibrariesDetail.forEach((detail) => {
                  if (part.id == detail.common_libraries_id) {
                    part.common_libraries_id = detail.common_libraries_id;
                    part.is_show_again_message = detail.is_show_again_message;
                    part.exercise_link = detail.exercise_link;
                    part.repetition_max = detail.repetition_max;
                  }
                });
              });
            }

            const userFavoriteLibraries = user_library.favorite_libraries;
            if (userFavoriteLibraries.length == 0) {
              return res.json(
                success(
                  "No favorite libraries, please add one",
                  { list: [] },
                  res.statusCode
                )
              );
            }

            var selectedFavoriteLibraries = [];

            common_library.forEach((part) => {
              userFavoriteLibraries.forEach((favorite_library) => {
                if (part.id == favorite_library) {
                  part.is_favorite = true;
                  selectedFavoriteLibraries.push(part);
                }
              });
            });

            const sub_parent_ids = [];

            selectedFavoriteLibraries.forEach((element) => {
              sub_parent_ids.push(element.sub_header_id);
            });

            return bodyPartsModel.find(
              { id: { $in: sub_parent_ids } },
              (err, body_parts) => {
                if (err) {
                  return res
                    .status(500)
                    .json(error("Cannot get common libraries", res.statusCode));
                }

                if (!body_parts) {
                  return res.json(
                    success(
                      "Success find body parts data",
                      null,
                      res.statusCode
                    )
                  );
                }

                if (user_library != undefined && user_library != null) {
                  // Search for favorite user_library
                  const favorite_libraries = user_library.favorite_libraries;

                  if (
                    favorite_libraries !== undefined ||
                    favorite_libraries.length > 0
                  ) {
                    // array exists
                    selectedFavoriteLibraries.forEach((library) => {
                      favorite_libraries.forEach((favorite_library) => {
                        if (library.id == favorite_library) {
                          console.log(library.id);
                          library.is_favorite = 1;
                        }
                      });
                    });
                  }
                }

                const searchKeyword =
                  search == null || search == undefined || search == ""
                    ? ""
                    : search;

                body_parts.forEach((body) => {
                  selectedFavoriteLibraries.forEach((library) => {
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
                        library._doc.targeted_muscles_ids =
                          splittedMusclesString;
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
                    "Success get library list",
                    { list: body_parts },
                    res.statusCode
                  )
                );
              }
            );
          }
        );
      });
    }
    // END OF FAVORITE QUERY

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

              return user_librariesModel.findOne(
                { user_id: id },
                (err, user_library) => {
                  if (err) {
                    return res
                      .status(500)
                      .json(
                        error(
                          "Error server while get user libraries",
                          res.statusCode
                        )
                      );
                  }

                  if (user_library != undefined && user_library != null) {
                    const savedCommonLibrariesDetail =
                      user_library.saved_common_libraries_detail;
                    if (
                      savedCommonLibrariesDetail !== undefined &&
                      savedCommonLibrariesDetail.length > 0
                    ) {
                      // Assign Personal Common Libraries Detail if exist
                      common_libraries.forEach((part) => {
                        savedCommonLibrariesDetail.forEach((detail) => {
                          if (part.id == detail.common_libraries_id) {
                            part.common_libraries_id =
                              detail.common_libraries_id;
                            part.is_show_again_message =
                              detail.is_show_again_message;
                            part.exercise_link = detail.exercise_link;
                            part.repetition_max = detail.repetition_max;
                          }
                        });
                      });
                    }
                    // Search for favorite user_library
                    const favorite_libraries = user_library.favorite_libraries;

                    if (
                      favorite_libraries !== undefined ||
                      favorite_libraries.length > 0
                    ) {
                      // array exists
                      common_libraries.forEach((library) => {
                        favorite_libraries.forEach((favorite_library) => {
                          if (library.id == favorite_library) {
                            library.is_favorite = 1;
                          }
                        });
                      });
                    }
                  }

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
                          library._doc.targeted_muscles_ids =
                            splittedMusclesString;
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
        if (index > -1) {
          // only splice array when item is found
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

exports.updateCommonLibrariesDetail = (req, res) => {
  const { authorization } = req.headers;

  const {
    common_libraries_id,
    exercise_link,
    is_show_again_message,
    selected_rm,
    repetition_max,
  } = req.body;

  if (
    common_libraries_id == undefined ||
    common_libraries_id == null ||
    common_libraries_id == ""
  ) {
    return res.status(403).json(error("Error request", res.statusCode));
  }

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(500).json(error("Can't find user", res.statusCode));
    }

    const user_id = user.id;

    return common_librariesModel.findOne(
      { id: common_libraries_id },
      (err, common_library) => {
        if (err || !common_library) {
          return res
            .status(500)
            .json(
              error(
                "Error server while get common library with that id, please try again",
                res.statusCode
              )
            );
        }

        return user_librariesModel.findOne({ user_id }, (err, user_library) => {
          if (err) {
            return res
              .status(500)
              .json(
                error(
                  "Error server while search for user library",
                  res.statusCode
                )
              );
          }

          if (!user_library) {
            // Create new model
            var userLibrary = new user_librariesModel();

            const detailToBeSaved = {
              common_libraries_id,
              exercise_link,
              is_show_again_message,
              selected_rm,
              repetition_max,
            };
            const saved_common_libraries_detail = [];
            saved_common_libraries_detail.push(detailToBeSaved);

            const updatedData = {
              saved_common_libraries_detail,
              user_id,
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
                success(
                  "Success save common library details",
                  null,
                  res.statusCode
                )
              );
            });
          }

          // Else, we update current model
          var tempSavedCommonLibrary = [];
          const saved_common_libraries_detail =
            user_library.saved_common_libraries_detail;
          if (
            saved_common_libraries_detail != undefined &&
            saved_common_libraries_detail.length > 0
          ) {
            // if saved_common_libraries not empty and null
            saved_common_libraries_detail.forEach((library) => {
              tempSavedCommonLibrary.push(library);
            });
          }

          var tempIndex = -1;
          var savedDetail = null;
          tempSavedCommonLibrary.forEach((library) => {
            tempIndex += 1;
            if (library.common_libraries_id == common_libraries_id) {
              // If already exist, we remove that item from database
              savedDetail = library;
              tempSavedCommonLibrary.splice(tempIndex, 1);
            }
          });

          // If saved detail is not null, we will update that object instead create new object
          if (savedDetail !== null) {
            const updatedData = {};

            // if exerice link is not null, we will update
            if (
              exercise_link != undefined ||
              exercise_link != null ||
              exercise_link != ""
            ) {
              updatedData.exercise_link = exercise_link;
            }

            // if user want to update is_show_again_message of library
            if (
              is_show_again_message != undefined ||
              is_show_again_message != null
            ) {
              updatedData.is_show_again_message = is_show_again_message;
            }

            // if user want to update records of library
            if (
              (selected_rm != undefined || selected_rm != null) &&
              (repetition_max != undefined || repetition_max != null)
            ) {
              updatedData.repetition_max = repetition_max;
              updatedData.selected_rm = selected_rm;
            }

            savedDetail = _.extend(savedDetail, updatedData);

            tempSavedCommonLibrary.push(savedDetail);

            const parentUpdatedData = {
              saved_common_libraries_detail: tempSavedCommonLibrary,
              user_id,
            };

            user_library = _.extend(user_library, parentUpdatedData);

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
                success(
                  "Success update library detail",
                  { ...savedDetail._doc, user_id },
                  res.statusCode
                )
              );
            });
          }

          const detailToBeSaved = {
            common_libraries_id,
            exercise_link,
            is_show_again_message,
            selected_rm,
            repetition_max,
          };
          tempSavedCommonLibrary.push(detailToBeSaved);

          const updatedData = {
            saved_common_libraries_detail: tempSavedCommonLibrary,
            user_id,
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
              success(
                "Success update library detail",
                { ...detailToBeSaved._doc, user_id },
                res.statusCode
              )
            );
          });
        });
      }
    );
  });
};

exports.addCustomLibraries = (req, res) => {
  const { authorization } = req.headers;
  const {
    exercise_name,
    user_id,
    regions_ids,
    category_id,
    mechanics_id,
    motion,
    movement,
    targeted_muscles_ids,
    action_force_id,
    equipment_ids,
    repetition_max,
    exercise_link,
    selected_rm,
  } = req.body;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res
        .status(500)
        .json(error("Can't find user with that id", res.statusCode));
    }

    const user_id = user.id;

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

        const customLibraryObjectToSave = {
          exercise_name,
          regions_ids: regions_ids.toString(),
          category_id,
          mechanics_id,
          motion,
          movement,
          targeted_muscles_ids: targeted_muscles_ids.toString(),
          action_force_id,
          equipment_ids: equipment_ids.toString(),
          repetition_max,
          exercise_link,
          selected_rm,
        };
        var customLibraries = [];
        customLibraries.push(customLibraryObjectToSave);

        const updatedData = {
          user_id,
          custom_common_libraries: customLibraries,
        };

        userLibrary = _.extend(userLibrary, updatedData);

        return userLibrary.save((err, result) => {
          if (err) {
            console.log(err)
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
            success("Library successfully created.", customLibraryObjectToSave, res.statusCode)
          );
        });
      }

      // If user library found, we will update the custom_common_library array
      var savedCustomLibraries = user_library.custom_common_libraries

      if (savedCustomLibraries == null || savedCustomLibraries == undefined) {
        savedCustomLibraries = [];
      }
      const customLibraryObjectToSave = {
        exercise_name,
        regions_ids: regions_ids.toString(),
        category_id,
        mechanics_id,
        motion,
        movement,
        targeted_muscles_ids: targeted_muscles_ids.toString(),
        action_force_id,
        equipment_ids: equipment_ids.toString(),
        repetition_max,
        exercise_link,
        selected_rm,
      };
      savedCustomLibraries.push(customLibraryObjectToSave);

      const updatedData = {
        custom_common_libraries: savedCustomLibraries,
      };

      user_library = _.extend(user_library, updatedData);

      return user_library.save((err, result) => {
        if (err) {
          console.log(err)
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
          success("Library successfully created.", customLibraryObjectToSave, res.statusCode)
        );
      });
    });
  });
};

// exports.deleteLibrary = (req, res) => {
//   const library_id = req.params.libraryId;
//   const { authorization } = req.headers;

//   authModel.findOne({ token: authorization }, (err, user) => {

//     if (err || !user) {
//       return res
//         .status(500)
//         .json(error("Can't find user with that id", res.statusCode));
//     }

//   });
// }
