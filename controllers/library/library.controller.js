const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const bodyPartsModel = require("../../models/body_parts.model");
const common_librariesModel = require("../../models/common_libraries.model");

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
                    const splittedRegionsString = library.regions_ids.split(/[, ]+/);
                    const splittedMusclesString = library.targeted_muscles_ids.split(/[, ]+/);
                    const splittedEquipmentsString = library.equipment_ids.split(/[, ]+/);
                    const splittedregions_secondary_idsString = library.regions_secondary_ids.split(/[, ]+/);
                    
                    library._doc.regions_ids = splittedRegionsString;
                    library._doc.targeted_muscles_ids = splittedMusclesString;
                    library._doc.equipment_ids = splittedEquipmentsString;
                    library._doc.regions_secondary_ids = splittedregions_secondary_idsString;
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
