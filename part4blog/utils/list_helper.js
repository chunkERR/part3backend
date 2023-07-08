const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const arrayLikes = blogs.map((blog) => blog.likes);
  const sumLikes = arrayLikes.reduce(
    (accumulator, current) => accumulator + current,
    0
  );
  return sumLikes;
};

const favoriteBlog = (blogs) => {
  const max = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  console.log(max);
  return max;
};

const mostBlogs = (blogs) => {
  const topAuthor = _.head(_(blogs).countBy("author").entries().maxBy(_.last));
  return `${topAuthor} ${topAuthor}`;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
