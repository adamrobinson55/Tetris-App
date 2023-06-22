const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require("../../utils/auth");

router.post('/', withAuth, async(req,res) => {
    try {
        const newComment = await Comment.create({
            user_id: req.session.user_id,
            comment_content: req.body.comment_content
        });

        res.status(200).json(newComment);

    } catch(err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
      const comment = await Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!comment) {
        res.status(404).json({ message: "No comment found with that id!" });
        return;
      }
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;