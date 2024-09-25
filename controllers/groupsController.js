const Categories = require("../models/Categories");
const Groups = require("../models/Groups");

const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

const multerConfiguration = {
  limits: { fileSize: 1000000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/groups/");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, next) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      next(null, true);
    } else {
      next(new Error("Invalid Format"), false);
    }
  },
};

const upload = multer(multerConfiguration).single("image");

exports.uploadImage = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "The file is too large");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      res.redirect("back");
      return;
    } else {
      next();
    }
  });
};

exports.newGroupForm = async (req, res) => {
  const categories = await Categories.findAll();

  res.render("new-group", {
    pageName: "Create New Group",
    categories,
  });
};

exports.newGroup = async (req, res, next) => {
  req.sanitizeBody("name");
  req.sanitizeBody("url");

  const group = req.body;

  group.userId = req.user.id;
  group.categoryId = req.body.category;

  if (req.file) {
    group.image = req.file.filename;
  }

  try {
    await Groups.create(group);
    req.flash("exito", "Group created successfully");
    res.redirect("/administration");
  } catch (error) {
    console.log(error);
    const sequelizeErrors = error.errors.map((err) => err.message);
    req.flash("error", sequelizeErrors);
    res.redirect("/new-group");
  }
};

exports.editGroupForm = async (req, res, next) => {
  const querys = [];
  querys.push(Groups.findByPk(req.params.groupId));
  querys.push(Categories.findAll());

  const [group, categories] = await Promise.all(querys);

  res.render("edit-group", {
    pageName: `Edit group : ${group.name}`,
    group,
    categories,
  });
};

exports.editGroup = async (req, res, next) => {
  const group = await Groups.findOne({
    where: { id: req.params.groupId, userId: req.user.id },
  });

  if (!group) {
    req.flash("error", "Invalid Operation");
    res.redirect(`/administration`);
    return next();
  }

  const { name, description, categoryId, url } = req.body;

  group.name = name;
  group.description = description;
  group.categoryId = categoryId;
  group.url = url;

  await group.save();

  req.flash("exito", "Group Saved Successfully");
  res.redirect("/administration");
};

exports.editImageForm = async (req, res, next) => {
  const group = await Groups.findOne({
    where: { id: req.params.groupId, userId: req.user.id },
  });

  if (!group) {
    req.flash("error", "Invalid Operation");
    res.redirect(`/administration`);
    return next();
  }

  res.render("edit-image", {
    pageName: `Edit Image : ${group.name}`,
    group,
  });
};

exports.editImage = async (req, res, next) => {
  const group = await Groups.findOne({
    where: { id: req.params.groupId, userId: req.user.id },
  });

  if (!group) {
    req.flash("error", "Invalid Operation");
    res.redirect(`/administration`);
    return next();
  }

  if (req.file && group.image) {
    const previousImagePath =
      __dirname + `/../public/uploads/groups/${group.image}`;

    fs.unlink(previousImagePath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  if (req.file) {
    group.image = req.file.filename;
  }

  await group.save();
  req.flash("exito", "Image Changed Successfully");
  res.redirect("/administration");
};

exports.deleteGroupForm = async (req, res, next) => {
  const group = await Groups.findOne({
    where: { id: req.params.groupId, userId: req.user.id },
  });

  if (!group) {
    req.flash("error", "Invalid Operation");
    res.redirect(`/administration`);
    return next();
  }

  res.render("delete-group", {
    pageName: `Delete Group : ${group.name}`,
    group,
  });
};

exports.deleteGroup = async (req, res, next) => {
  const group = await Groups.findOne({
    where: { id: req.params.groupId, userId: req.user.id },
  });

  if (!group) {
    req.flash("error", "Invalid Operation");
    res.redirect(`/administration`);
    return next();
  }

  if (group.image) {
    const imagePath =
      __dirname + `/../public/uploads/groups/${group.image}`;

    fs.unlink(imagePath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  await Groups.destroy({
    where: {
      id: req.params.groupId
    }
  });

  req.flash('exito', 'Group Deleted Successfully');
  res.redirect('/administration');
};
