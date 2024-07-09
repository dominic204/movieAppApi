const Movie = require('../models/Movie');
const auth = require("../auth");

module.exports.addMovie = (req, res) => {

	 if (req.user.isAdmin !== true) {
      return res.status(403).send({ error: 'User is forbidden' });
    }

		return Movie.findOne({ title: req.body.tile }).then(existingMovie => {

			let newMovie = new Movie({
				title : req.body.title,
				director : req.body.director,
				year : req.body.year,
				description : req.body.description,
				genre : req.body.genre
			});

			if(existingMovie) {
				return res.status(409).send({ error : 'Movie already exists' });
			}
			return newMovie.save().then(newMovie => res.status(201).send(newMovie)).catch(saveError => {

				console.error('Error in saving the movie: ', saveError);

				res.status(500).send({ error : 'Failed to save the movie' });
			});

		}).catch(findErr => {

			console.error('Error in adding the movie: ', findErr);

			return res.status(500).send({ message: "Error in adding the movie" });
		})
}


module.exports.getMovies = async (req, res) => {

    const movies = await Movie.find();
    return res.status(200).send({ movies });

};


module.exports.getMovie = (req, res) => {

  let movieID = req.params.movieId;

  return Movie.find({ _id: movieID })
    .then((movie) => {
      if (movie.length > 0) {
        return res.status(200).send({ movie });
      }

      return res.status(404).send({ error: "Movie not found" });
    })
    .catch((findErr) => {
      console.error(`Error in finding movie:`, findErr);
      return res.status(500).send({ error: "'Failed to fetch movie" });
    });
};


module.exports.updateMovie = (req, res) => {

	 if (req.user.isAdmin !== true) {
      return res.status(403).send({ error: 'User is forbidden' });
    }

	 Movie.findOne({ _id: req.params.movieId }).then((movie) => {
	 if (!movie) {
        return res.status(404).send({ error: "Movie not found" });
      }

       let updatedMovie = {
				title : req.body.title,
				director : req.body.director,
				year : req.body.year,
				description : req.body.description,
				genre : req.body.genre
			};

	  return Movie.findByIdAndUpdate(req.params.movieId, updatedMovie , { new: true})
	    .then((movie) => {
	      if (movie) {
	        res.status(200).send({ message: "Movie updated successfully", updatedMovie: movie });
	      } else {
	        res.status(404).send(false);
	      }
	    })
	    .catch((err) => res.status(500).send(err));

	 })
  
};

module.exports.deleteMovie = (req, res) => {

	 if (req.user.isAdmin !== true) {
      return res.status(403).send({ error: 'User is forbidden' });
    }

	 Movie.findOne({ _id: req.params.movieId}).then((movie) => {
	 	if (!movie) {
        return res.status(404).send({ error: "Movie not found" });
      }

		return Movie.deleteOne({_id : req.params.movieId}).then((deleted) => {
			if(deleted) {
				res.status(200).send({ message : "Movie deleted successfully"});
			} else {
				res.status(500).send("Deleting movie failed");
			}
		})
		  .catch((findErr) => {
	      console.error("Error to deleting movie: ", findErr);
	      return res.status(500).send({ error: "Failed to delete movie." });
	    });

  	})
};

module.exports.addComment = async (req, res) => {
  if (req.user.isAdmin === true) {
    return res.status(403).send({ error: 'Admin is forbidden' });
  }

  const movieId = req.params.movieId;
  const { comment } = req.body;
  const userId = req.user.id;

  try {
    const movie = await Movie.findByIdAndUpdate({ _id: movieId });

    if (!movie) {
      return res.status(404).send({ error: "Movie not found" });
    }

    movie.comments.push({ userId, comment });

    await movie.save().then((updatedMovie) => {
    	res.status(200).send({ message: "Movie updated successfully", updatedMovie });
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};


module.exports.getComments = (req, res) => {

  return Movie.findById(req.params.movieId)
    .then((movies) => {
      if (!movies) {
        return res.status(404).send({ error: "movies not found " });
      }

      return res.status(200).send({ comments: movies.comments });
    })
    .catch((findErr) => {
      console.error("Error finding courses: ", findErr);

      return res.status(500).send({ error: "Failed to fetch Movie" });
    });
};