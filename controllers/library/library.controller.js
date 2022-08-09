const {error,success } = require("../../helper/baseJsonResponse");
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
        relation
      } = req.body;

      authModel.findOne({ token: authorization }, (err, user) => {
        if (err || !user) {
          return res.status(401).json(error("Unauthorized", res.statusCode));
        }
    
        const id = user.id;
    
        return bodyPartsModel.find({code: status}, (err, body_parts) => {
            if (err) {
                return res.status(500).json(error("Cannot get body parts", res.statusCode));
            }

            if (!body_parts) {
                return res.json(success("Success find body parts data", null, res.statusCode));
            }
            const category_ids = []
            
            body_parts.forEach(element => {
                category_ids.push(element.id)
            });

            return common_librariesModel.find({ category_id: { $in: category_ids } }, (err, common_libraries) => {
                if (err) {
                    return res.status(500).json(error("Cannot get common libraries", res.statusCode));
                }

                if (!common_libraries) {
                    return res.json(success("Success find body parts data", null, res.statusCode));
                }

                const searchKeyword = search == null || search == undefined || search == '' ? "" : search

                body_parts.forEach(body => {
                    common_libraries.forEach(library => {
                        if (body.id.toString() == library.category_id && library.exercise_name.includes(searchKeyword)) {
                            body.data.push(library);
                        }
                    });
                });

                return res.json(success("Scucces get library list", { list: body_parts }, res.statusCode))
            })
        })
      });
}