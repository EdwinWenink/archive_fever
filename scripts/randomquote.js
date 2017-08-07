	writeRandomQuote = function () {
		var quotes = new Array();
		quotes[0] = "&quotEvery person takes the limits of their own field of vision for the limits of the world.&quot - Arthur Shopenhauer";
		quotes[1] = "&quotWithout music, life would be a mistake.&quot - Friedrich Nietzsche";
		quotes[2] = "&quotMan is the only creature who refuses to be what he is.&quot - Albert Camus";
		quotes[3] = "&quotLife contains but two tragedies. One is not to get your heart’s desire; the other is to get it.&quot - Socrates";
		quotes[4] = "&quotThere is no simple answer to such a question&quot - Jacques Derrida";
		quotes[5] = "&quotWhat cannot be said above all must not be silenced but written.&quot - Jacques Derrida";
		quotes[4] = "&quotWhereof one cannot speak, thereof one must be silent.&quot - Ludwig Wittgenstein";
		quotes[4] = "&quotThe human body is the best picture of the human soul.&quot - Ludwig Wittgenstein";
		var rand = Math.floor(Math.random()*quotes.length);
		document.write(quotes[rand]);
  }

  writeRandomQuote();