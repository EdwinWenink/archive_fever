	writeRandomQuote = function () {
		var quotes = new Array();
		quotes[0] = "&quotEvery person takes the limits of their own field of vision for the limits of the world.&quot - Arthur Shopenhauer";
		quotes[1] = "&quotWithout music, life would be a mistake.&quot - Friedrich Nietzsche";
		quotes[2] = "&quotMan is the only creature who refuses to be what he is.&quot - Albert Camus";
		quotes[3] = "&quotLife contains but two tragedies. One is not to get your heart's desire; the other is to get it.&quot - Socrates";
		quotes[4] = "&quotThere is no simple answer to such a question&quot - Jacques Derrida";
		quotes[5] = "&quotWhat cannot be said above all must not be silenced but written.&quot - Jacques Derrida";
		quotes[6] = "&quotWhereof one cannot speak, thereof one must be silent.&quot - Ludwig Wittgenstein";
		quotes[7] = "&quotThe human body is the best picture of the human soul.&quot - Ludwig Wittgenstein";
		quotes[8]= "&quotPhilosophy is written in this grand book, the universe, which stands continually open to our gaze. But the book cannot be understood unless one first learns to comprehend the language and read the letters in which it is composed.&quot - Galileo Galilei";
		quotes[9]= "&quotSkepticism is the first step on the road to philosophy.&quot - Denis Diderot";
		quotes[10]= "&quotExperience has shown, and a true philosophy will always show, that a vast, perhaps the larger portion of the truth arises from the seemingly irrelevant.&quot - Edgar Allan Poe";
		quotes[11]= "&quotGenerally speaking, the errors in religion are dangerous; those in philosophy only ridiculous.&quot - David Hume";
		quotes[12]= "&quotScience is what you know, philosophy is what you don't know.&quot - Bertrand Russell";
		quotes[13]= "&quotEvery man is born as many men and dies as a single one.&quot - Martin Heidegger";
		quotes[14]= "&quotLanguage is the house of the truth of Being&quot - Martin Heidegger";
		quotes[15]= "&quotWhy are there beings at all, instead of Nothing?&quot - Martin Heidegger";
		quotes[16]= "&quotPhilosophy begins in wonder. And, at the end, when philosophic thought has done its best, the wonder remains.&quot - Alfred North Whitehead";
		quotes[17]= "&quotWords are never &#39only words&#39;; they matter because they define the contours of what we can do.&quot - Slavoj Zizek";
		/*
		quotes[x]= "&quot &quot";
		*/
		
		var rand = Math.floor(Math.random()*quotes.length);
		document.write(quotes[rand]);
  }

  writeRandomQuote();