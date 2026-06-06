(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const els = {
    setup: $("setupScreen"),
    presentation: $("presentationScreen"),
    grades: $("gradeOptions"),
    units: $("unitOptions"),
    gradeStatus: $("gradeStatus"),
    unitStatus: $("unitStatus"),
    poolSummary: $("poolSummary"),
    start: $("startButton"),
    startQuiz: $("startQuizButton"),
    back: $("backButton"),
    fullscreen: $("fullscreenButton"),
    sessionLabel: $("sessionLabel"),
    progressText: $("progressText"),
    progressBar: $("progressBar"),
    wordView: $("wordView"),
    wordImage: $("wordImage"),
    imageFallback: $("imageFallback"),
    wordGuessPanel: $("wordGuessPanel"),
    wordGuessOptions: $("wordGuessOptions"),
    wordTitleRow: $("wordTitleRow"),
    englishWord: $("englishWord"),
    speakWord: $("speakWordButton"),
    meaningBlock: $("meaningBlock"),
    turkishMeaning: $("turkishMeaning"),
    definitionBlock: $("definitionBlock"),
    englishDefinition: $("englishDefinition"),
    wordRelations: $("wordRelations"),
    synonymInfo: $("synonymInfo"),
    oppositeInfo: $("oppositeInfo"),
    quizView: $("quizView"),
    quizBadge: $("quizBadge"),
    quizQuestion: $("quizQuestion"),
    quizHint: $("quizHint"),
    quizImage: $("quizImage"),
    relationWord: $("relationWord"),
    quizOptions: $("quizOptions"),
    quizFeedback: $("quizFeedback"),
    finishOffer: $("finishOfferView"),
    acceptQuiz: $("acceptQuizButton"),
    declineQuiz: $("declineQuizButton"),
    quizResults: $("quizResultsView"),
    quizResultScore: $("quizResultScore"),
    quizResultMessage: $("quizResultMessage"),
    quizMistakes: $("quizMistakes"),
    resultsHome: $("resultsHomeButton"),
    farewell: $("farewellView"),
    navigation: $("navigationBar"),
    previous: $("previousButton"),
    revealTurkish: $("revealTurkishButton"),
    next: $("nextButton"),
    dots: $("checkpointDots")
  };

  const records = typeof QUESTIONS === "undefined"
    ? []
    : QUESTIONS.filter((item) => Array.isArray(item) && item[2] && Number(item[3]) > 0);

  const synonymGroups = typeof SYNONYM_PAIRS === "undefined"
    ? []
    : SYNONYM_PAIRS.filter((group) => Array.isArray(group) && group.length >= 4);

  const state = {
    grade: null,
    unit: null,
    pool: [],
    index: 0,
    mode: "word",
    wordStage: "guess",
    revealTimer: null,
    speechTimer: null,
    feedbackAudio: null,
    quizCheckpoint: null,
    completedCheckpoints: new Set(),
    completedRelationCheckpoints: new Set(),
    finalQuizQuestions: [],
    finalQuizIndex: 0,
    finalQuizScore: 0,
    finalQuizMistakes: []
  };

  function uniqueSorted(values) {
    return [...new Set(values)].sort((a, b) => a - b);
  }

  function createChoice(label, details, selected, onClick) {
    const button = document.createElement("button");
    button.className = `choice-button${selected ? " selected" : ""}`;
    button.innerHTML = `${label}${details ? `<small>${details}</small>` : ""}`;
    button.addEventListener("click", onClick);
    return button;
  }

  function renderGrades() {
    els.grades.replaceChildren();
    uniqueSorted(records.map((item) => item[3])).forEach((grade) => {
      const count = records.filter((item) => item[3] === grade).length;
      els.grades.append(createChoice(
        `Grade ${grade}`,
        `${count} words`,
        state.grade === grade,
        () => selectGrade(grade)
      ));
    });
  }

  function selectGrade(grade) {
    state.grade = grade;
    state.unit = null;
    els.gradeStatus.textContent = `Grade ${grade} selected`;
    els.unitStatus.textContent = "Select a unit";
    renderGrades();
    renderUnits();
    updateSetupSummary();
  }

  function renderUnits() {
    els.units.replaceChildren();
    if (!state.grade) {
      els.units.className = "option-grid unit-grid empty-options";
      els.units.innerHTML = "<p>Available units will appear here after selecting a grade.</p>";
      return;
    }

    els.units.className = "option-grid unit-grid";
    const units = uniqueSorted(records.filter((item) => item[3] === state.grade).map((item) => item[5]));
    units.forEach((unit) => {
      const count = records.filter((item) => item[3] === state.grade && item[5] === unit).length;
      els.units.append(createChoice(
        `Unit ${unit}`,
        `${count} words`,
        state.unit === unit,
        () => {
          state.unit = unit;
          els.unitStatus.textContent = `Unit ${unit} selected`;
          renderUnits();
          updateSetupSummary();
        }
      ));
    });
  }

  function updateSetupSummary() {
    const ready = state.grade && state.unit;
    const count = ready
      ? records.filter((item) => item[3] === state.grade && item[5] === state.unit).length
      : 0;
    els.start.disabled = !ready;
    els.startQuiz.disabled = !ready;
    els.poolSummary.innerHTML = ready
      ? `<strong>${count}-word presentation ready</strong><span>A quick review appears after every 5 words.</span>`
      : "<strong>Not ready</strong><span>Select a grade and unit to continue.</span>";
  }

  function imagePath(record) {
    return record[6] || "";
  }

  function startPresentation() {
    state.pool = records.filter((item) => item[3] === state.grade && item[5] === state.unit);
    state.index = 0;
    state.mode = "word";
    state.completedCheckpoints.clear();
    state.completedRelationCheckpoints.clear();
    els.setup.classList.add("hidden");
    els.presentation.classList.remove("hidden");
    renderWord();
  }

  function renderWord() {
    clearTimeout(state.revealTimer);
    clearTimeout(state.speechTimer);
    window.speechSynthesis?.cancel();
    stopFeedbackAudio();
    state.mode = "word";
    state.wordStage = "guess";
    const record = state.pool[state.index];
    els.wordView.classList.remove("hidden");
    els.quizView.classList.add("hidden");
    els.englishWord.textContent = record[2];
    applyTextSize(els.englishWord, record[2]);
    els.turkishMeaning.textContent = TurkishAdapter.getMeaning(record);
    els.englishDefinition.textContent = record[0];
    els.wordGuessPanel.classList.remove("hidden");
    els.wordTitleRow.classList.add("hidden");
    els.meaningBlock.classList.add("hidden");
    els.revealTurkish.classList.remove("hidden");
    els.turkishMeaning.classList.add("hidden");
    els.definitionBlock.classList.add("hidden");
    els.wordRelations.classList.add("hidden");
    renderWordGuessOptions(record);
    els.wordImage.alt = `Image for the word ${record[2]}`;
    els.imageFallback.classList.add("hidden");
    els.wordImage.classList.remove("hidden");
    els.wordImage.src = imagePath(record);
    els.wordImage.onerror = () => {
      els.wordImage.classList.add("hidden");
      els.imageFallback.classList.remove("hidden");
    };
    updateChrome();
  }

  function renderWordGuessOptions(record) {
    const wrong = sample(getSafeDistractors(record), 2);
    const choices = sample([record, ...wrong], 3);
    els.wordGuessOptions.replaceChildren();
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "word-guess-option";
      button.textContent = choice[2];
      applyTextSize(button, choice[2]);
      button.addEventListener("click", () => answerWordGuess(button, choice[2] === record[2], record[2]));
      els.wordGuessOptions.append(button);
    });
  }

  function answerWordGuess(selectedButton, isCorrect, answer) {
    if (state.mode !== "word" || state.wordStage !== "guess") return;
    state.wordStage = "feedback";
    const answeredIndex = state.index;
    [...els.wordGuessOptions.children].forEach((button) => {
      button.disabled = true;
      if (button.textContent === answer) button.classList.add("correct");
    });
    if (!isCorrect) selectedButton.classList.add("wrong");
    Promise.all([playFeedbackSound(isCorrect), wait(1200)]).then(() => {
      if (state.mode === "word" && state.wordStage === "feedback" && state.index === answeredIndex) {
        revealEnglish();
      }
    });
  }

  function revealEnglish() {
    if (state.mode !== "word" || state.wordStage !== "feedback") return;
    state.wordStage = "english";
    els.wordGuessPanel.classList.add("hidden");
    els.wordTitleRow.classList.remove("hidden");
    els.meaningBlock.classList.remove("hidden");
    els.definitionBlock.classList.remove("hidden");
    renderWordRelations(state.pool[state.index]);
    speakWordTwice();
    updateChrome();
  }

  function speakWord() {
    if (!("speechSynthesis" in window) || !state.pool[state.index]) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(state.pool[state.index][2].toLowerCase());
    utterance.lang = "en-US";
    utterance.rate = .82;
    utterance.pitch = 1;
    const englishVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  }

  function speakWordTwice() {
    clearTimeout(state.speechTimer);
    speakWord();
    state.speechTimer = setTimeout(speakWord, 2000);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => {
      state.revealTimer = setTimeout(resolve, milliseconds);
    });
  }

  function stopFeedbackAudio() {
    if (!state.feedbackAudio) return;
    state.feedbackAudio.pause();
    state.feedbackAudio.currentTime = 0;
    state.feedbackAudio = null;
  }

  function playFeedbackSound(isCorrect) {
    window.speechSynthesis?.cancel();
    clearTimeout(state.speechTimer);
    stopFeedbackAudio();

    return new Promise((resolve) => {
      const audio = new Audio(isCorrect ? "sounds/correct.mp3" : "sounds/wrong.mp3");
      state.feedbackAudio = audio;
      audio.volume = .8;
      const finish = () => {
        if (state.feedbackAudio === audio) state.feedbackAudio = null;
        resolve();
      };
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      audio.play().catch(finish);
    });
  }

  function revealTurkish() {
    if (state.mode !== "word" || state.wordStage !== "english") return;
    state.wordStage = "turkish";
    els.revealTurkish.classList.add("hidden");
    els.turkishMeaning.classList.remove("hidden");
    updateChrome();
  }

  function renderWordRelations(record) {
    const synonyms = new Set();
    const opposites = new Set();
    synonymGroups.forEach(([grade, unit, ...words]) => {
      if (grade === record[3] && unit === record[5] && words.includes(record[2])) {
        words.filter((word) => word !== record[2]).forEach((word) => synonyms.add(word));
      }
    });
    (typeof OPPOSITE_PAIRS === "undefined" ? [] : OPPOSITE_PAIRS).forEach((group) => {
      if (!Array.isArray(group) || group.length < 4 || group[0] !== record[3] || group[1] !== record[5]) return;
      const words = group.slice(2);
      if (!words.includes(record[2])) return;
      if (words.length === 2) words.filter((word) => word !== record[2]).forEach((word) => opposites.add(word));
      else if (record[2] === words[0]) words.slice(1).forEach((word) => opposites.add(word));
      else opposites.add(words[0]);
    });
    els.synonymInfo.textContent = synonyms.size ? `SYNONYMS: ${[...synonyms].join(", ")}` : "";
    els.oppositeInfo.textContent = opposites.size ? `OPPOSITES: ${[...opposites].join(", ")}` : "";
    els.synonymInfo.classList.toggle("hidden", !synonyms.size);
    els.oppositeInfo.classList.toggle("hidden", !opposites.size);
    els.wordRelations.classList.toggle("hidden", !synonyms.size && !opposites.size);
  }

  function updateChrome() {
    const atEnd = state.index === state.pool.length - 1;
    els.sessionLabel.textContent = `Grade ${state.grade} · Unit ${state.unit}`;
    els.progressText.textContent = `${state.index + 1} / ${state.pool.length}`;
    els.progressBar.style.width = `${((state.index + 1) / state.pool.length) * 100}%`;
    els.navigation.classList.toggle("hidden", ["offer", "results", "farewell"].includes(state.mode));
    els.previous.classList.toggle("hidden", state.index === 0 || state.mode !== "word");
    els.next.textContent = state.mode !== "word" ? "Continue →" : atEnd ? "Finish Presentation ✓" : "Next →";
    els.next.classList.toggle("hidden", state.mode === "word" && state.wordStage !== "turkish");
    els.next.disabled = state.mode !== "word" || state.wordStage !== "turkish";
    renderDots();
  }

  function renderDots() {
    els.dots.replaceChildren();
    state.pool.forEach((_, index) => {
      const dot = document.createElement("span");
      if (index === state.index) dot.classList.add("active");
      if ((index + 1) % 5 === 0 && state.completedCheckpoints.has(index + 1)) dot.classList.add("quiz-done");
      if ((index + 1) % 7 === 0 && state.completedRelationCheckpoints.has(index + 1)) dot.classList.add("relation-done");
      els.dots.append(dot);
    });
  }

  function pendingCheckpoint() {
    const checkpoint = state.index + 1;
    if (checkpoint % 5 === 0 && !state.completedCheckpoints.has(checkpoint)) return "quiz";
    if (checkpoint % 7 === 0 && !state.completedRelationCheckpoints.has(checkpoint)) return "relation";
    return null;
  }

  function next() {
    if (state.mode === "finalQuiz") {
      state.finalQuizIndex += 1;
      if (state.finalQuizIndex >= state.finalQuizQuestions.length) showQuizResults();
      else renderFinalQuizQuestion();
      return;
    }
    if (state.mode !== "word") {
      if (state.mode === "quiz") state.completedCheckpoints.add(state.quizCheckpoint);
      if (state.mode === "relation") state.completedRelationCheckpoints.add(state.quizCheckpoint);
      showCheckpointOrAdvance();
      return;
    }
    showCheckpointOrAdvance();
  }

  function showCheckpointOrAdvance() {
    const checkpoint = pendingCheckpoint();
    if (checkpoint === "quiz") {
      showQuiz();
    } else if (checkpoint === "relation") {
      showRelationQuiz();
    } else if (state.index < state.pool.length - 1) {
      state.index += 1;
      renderWord();
    } else {
      finishPresentation();
    }
  }

  function previous() {
    if (state.mode === "word" && state.index > 0) {
      state.index -= 1;
      renderWord();
    }
  }

  function sample(items, count) {
    return [...items].sort(() => Math.random() - .5).slice(0, count);
  }

  function uniqueByAnswer(items) {
    return [...new Map(items.map((item) => [item[2], item])).values()];
  }

  function applyTextSize(element, text) {
    const length = String(text || "").length;
    element.classList.remove("text-long", "text-xlong", "text-xxlong");
    if (length >= 24) element.classList.add("text-xxlong");
    else if (length >= 17) element.classList.add("text-xlong");
    else if (length >= 12) element.classList.add("text-long");
  }

  function normalizeMeaning(value) {
    return String(value || "")
      .toLocaleUpperCase("tr-TR")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function getSynonyms(record) {
    const related = new Set([record[2]]);
    synonymGroups.forEach((group) => {
      const [grade, unit, ...words] = group;
      if (grade === record[3] && unit === record[5] && words.includes(record[2])) {
        words.forEach((word) => related.add(word));
      }
    });
    return related;
  }

  function getSafeDistractors(record) {
    const synonyms = getSynonyms(record);
    const rivalsExclusions = new Set(
      typeof RivalsDistractorAdapter === "undefined"
        ? []
        : RivalsDistractorAdapter.get(record[3], record[5], record[2])
    );
    const meaning = normalizeMeaning(TurkishAdapter.getMeaning(record));
    const image = imagePath(record);
    const definition = String(record[0] || "").trim().toLowerCase();

    const safe = uniqueByAnswer(state.pool.filter((candidate) => {
      if (synonyms.has(candidate[2])) return false;
      if (rivalsExclusions.has(candidate[2])) return false;
      if (
        typeof RivalsDistractorAdapter !== "undefined"
        && RivalsDistractorAdapter.get(candidate[3], candidate[5], candidate[2]).includes(record[2])
      ) return false;
      if (image && imagePath(candidate) === image) return false;
      if (meaning && normalizeMeaning(TurkishAdapter.getMeaning(candidate)) === meaning) return false;
      if (definition && String(candidate[0] || "").trim().toLowerCase() === definition) return false;
      return true;
    }));

    if (safe.length >= 3) return safe;
    return uniqueByAnswer(state.pool.filter((candidate) => {
      if (synonyms.has(candidate[2]) || rivalsExclusions.has(candidate[2])) return false;
      return typeof RivalsDistractorAdapter === "undefined"
        || !RivalsDistractorAdapter.get(candidate[3], candidate[5], candidate[2]).includes(record[2]);
    }));
  }

  function showQuiz() {
    state.mode = "quiz";
    state.quizCheckpoint = state.index + 1;
    const recentStart = Math.max(0, state.index - 4);
    const recent = state.pool.slice(recentStart, state.index + 1);
    const answer = sample(recent, 1)[0];
    const wrong = sample(getSafeDistractors(answer), 3);
    const choices = sample([answer, ...wrong], 4);

    els.wordView.classList.add("hidden");
    els.quizView.classList.remove("hidden");
    els.quizBadge.textContent = "5 WORD CHECK";
    els.quizQuestion.textContent = "Which word matches this image?";
    els.quizHint.textContent = "Recall one of the last five words.";
    els.relationWord.classList.add("hidden");
    els.quizImage.src = imagePath(answer);
    els.quizFeedback.textContent = "";
    els.quizOptions.replaceChildren();

    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = choice[2];
      applyTextSize(button, choice[2]);
      button.addEventListener("click", () => answerQuiz(button, choice[2] === answer[2], answer[2]));
      els.quizOptions.append(button);
    });
    updateChrome();
  }

  function showRelationQuiz() {
    const relation = createRelationQuestion();
    if (!relation) {
      state.completedRelationCheckpoints.add(state.index + 1);
      showCheckpointOrAdvance();
      return;
    }

    state.mode = "relation";
    state.quizCheckpoint = state.index + 1;
    els.wordView.classList.add("hidden");
    els.quizView.classList.remove("hidden");
    els.quizBadge.textContent = `7 WORD ${relation.type} CHECK`;
    els.quizQuestion.textContent = `Which one is the ${relation.type} of this word?`;
    els.quizHint.textContent = "Choose the word with the correct relationship.";
    els.quizImage.src = imagePath(relation.source);
    els.relationWord.textContent = relation.source[2];
    applyTextSize(els.relationWord, relation.source[2]);
    els.relationWord.classList.remove("hidden");
    els.quizFeedback.textContent = "";
    els.quizOptions.replaceChildren();

    relation.choices.forEach((word) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = word;
      applyTextSize(button, word);
      button.addEventListener("click", () => answerQuiz(button, word === relation.answer, relation.answer));
      els.quizOptions.append(button);
    });
    updateChrome();
  }

  function createRelationQuestion() {
    const poolByWord = new Map(state.pool.map((record) => [record[2], record]));
    const synonymRelations = synonymGroups
      .filter(([grade, unit]) => grade === state.grade && unit === state.unit)
      .flatMap((group) => {
        const words = group.slice(2);
        return words.filter((word) => poolByWord.has(word)).map((word) => ({
          type: "SYNONYM",
          source: poolByWord.get(word),
          answers: words.filter((candidate) => candidate !== word)
        }));
      });
    const oppositeRelations = (typeof OPPOSITE_PAIRS === "undefined" ? [] : OPPOSITE_PAIRS)
      .filter((group) => Array.isArray(group) && group.length >= 4 && group[0] === state.grade && group[1] === state.unit)
      .flatMap((group) => {
        const words = group.slice(2);
        if (words.length > 2) {
          return poolByWord.has(words[0]) ? [{ type: "OPPOSITE", source: poolByWord.get(words[0]), answers: words.slice(1) }] : [];
        }
        return words.filter((word) => poolByWord.has(word)).map((word) => ({
          type: "OPPOSITE",
          source: poolByWord.get(word),
          answers: words.filter((candidate) => candidate !== word)
        }));
      });
    const relation = sample([...synonymRelations, ...oppositeRelations].filter((item) => item.answers.length), 1)[0];
    if (!relation) return null;

    const answer = sample(relation.answers, 1)[0];
    const excluded = new Set([relation.source[2], ...relation.answers]);
    const distractors = sample(
      uniqueByAnswer(state.pool.filter((record) => !excluded.has(record[2]))).map((record) => record[2]),
      3
    );
    return { ...relation, answer, choices: sample([answer, ...distractors], 4) };
  }

  function answerQuiz(selectedButton, isCorrect, answer) {
    [...els.quizOptions.children].forEach((button) => {
      button.disabled = true;
      if (button.textContent === answer) button.classList.add("correct");
    });
    if (!isCorrect) selectedButton.classList.add("wrong");
    playFeedbackSound(isCorrect);
    if (state.mode === "finalQuiz") {
      if (isCorrect) {
        state.finalQuizScore += 1;
      } else {
        state.finalQuizMistakes.push({
          record: state.finalQuizQuestions[state.finalQuizIndex],
          selected: selectedButton.textContent,
          answer
        });
      }
    }
    els.quizFeedback.textContent = isCorrect ? "Great, correct answer!" : `Correct answer: ${answer}`;
    els.quizFeedback.style.color = isCorrect ? "#13795b" : "#a83a25";
    els.next.disabled = false;
  }

  function finishPresentation() {
    clearTimeout(state.revealTimer);
    clearTimeout(state.speechTimer);
    window.speechSynthesis?.cancel();
    stopFeedbackAudio();
    state.completedCheckpoints.clear();
    state.completedRelationCheckpoints.clear();
    state.mode = "offer";
    hidePresentationViews();
    els.finishOffer.classList.remove("hidden");
    updateChrome();
  }

  function startFinalQuiz() {
    state.pool = records.filter((item) => item[3] === state.grade && item[5] === state.unit);
    const shuffled = sample(state.pool, state.pool.length);
    state.finalQuizQuestions = shuffled.slice(0, 20);
    while (state.finalQuizQuestions.length < 20) {
      state.finalQuizQuestions.push(state.pool[state.finalQuizQuestions.length % state.pool.length]);
    }
    state.finalQuizIndex = 0;
    state.finalQuizScore = 0;
    state.finalQuizMistakes = [];
    state.mode = "finalQuiz";
    els.setup.classList.add("hidden");
    els.presentation.classList.remove("hidden");
    renderFinalQuizQuestion();
  }

  function renderFinalQuizQuestion() {
    const answer = state.finalQuizQuestions[state.finalQuizIndex];
    const choices = sample([answer, ...sample(getSafeDistractors(answer), 3)], 4);
    hidePresentationViews();
    els.quizView.classList.remove("hidden");
    els.navigation.classList.remove("hidden");
    els.quizBadge.textContent = `20 WORD QUIZ · ${state.finalQuizIndex + 1} / 20`;
    els.quizQuestion.textContent = "Which word matches this image?";
    els.quizHint.textContent = "Choose the correct word.";
    els.quizImage.src = imagePath(answer);
    els.relationWord.classList.add("hidden");
    els.quizFeedback.textContent = "";
    els.quizOptions.replaceChildren();
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = choice[2];
      applyTextSize(button, choice[2]);
      button.addEventListener("click", () => answerQuiz(button, choice[2] === answer[2], answer[2]));
      els.quizOptions.append(button);
    });
    els.sessionLabel.textContent = `Grade ${state.grade} · Unit ${state.unit}`;
    els.progressText.textContent = `${state.finalQuizIndex + 1} / 20`;
    els.progressBar.style.width = `${((state.finalQuizIndex + 1) / 20) * 100}%`;
    els.previous.classList.add("hidden");
    els.next.textContent = state.finalQuizIndex === 19 ? "SEE RESULTS →" : "NEXT QUESTION →";
    els.next.classList.remove("hidden");
    els.next.disabled = true;
  }

  function showQuizResults() {
    state.mode = "results";
    hidePresentationViews();
    els.quizResults.classList.remove("hidden");
    els.quizResultScore.textContent = `${state.finalQuizScore} / 20`;
    els.quizResultMessage.textContent = `${state.finalQuizScore} correct · ${20 - state.finalQuizScore} incorrect`;
    renderQuizMistakes();
    updateChrome();
    els.progressText.textContent = "20 / 20";
    els.progressBar.style.width = "100%";
  }

  function renderQuizMistakes() {
    els.quizMistakes.replaceChildren();
    if (!state.finalQuizMistakes.length) {
      const perfect = document.createElement("p");
      perfect.className = "perfect-score";
      perfect.textContent = "Perfect score! No words to review.";
      els.quizMistakes.append(perfect);
      return;
    }

    state.finalQuizMistakes.forEach((mistake, index) => {
      const card = document.createElement("article");
      card.className = "mistake-card";
      card.innerHTML = `
        <img src="${imagePath(mistake.record)}" alt="Image for ${mistake.answer}">
        <div>
          <span>QUESTION ${index + 1}</span>
          <p class="mistake-selected">YOUR ANSWER: <strong>${mistake.selected}</strong></p>
          <p class="mistake-correct">CORRECT ANSWER: <strong>${mistake.answer}</strong></p>
        </div>
      `;
      els.quizMistakes.append(card);
    });
  }

  function hidePresentationViews() {
    els.wordView.classList.add("hidden");
    els.quizView.classList.add("hidden");
    els.finishOffer.classList.add("hidden");
    els.quizResults.classList.add("hidden");
    els.farewell.classList.add("hidden");
  }

  function showFarewell() {
    state.mode = "farewell";
    hidePresentationViews();
    els.farewell.classList.remove("hidden");
    updateChrome();
    setTimeout(returnToSetup, 1800);
  }

  function returnToSetup() {
    clearTimeout(state.revealTimer);
    clearTimeout(state.speechTimer);
    window.speechSynthesis?.cancel();
    stopFeedbackAudio();
    hidePresentationViews();
    els.presentation.classList.add("hidden");
    els.setup.classList.remove("hidden");
    els.poolSummary.innerHTML = `<strong>Ready for another round</strong><span>Select a grade and unit to continue.</span>`;
  }

  els.start.addEventListener("click", startPresentation);
  els.startQuiz.addEventListener("click", startFinalQuiz);
  els.next.addEventListener("click", next);
  els.previous.addEventListener("click", previous);
  els.revealTurkish.addEventListener("click", revealTurkish);
  els.speakWord.addEventListener("click", speakWord);
  els.acceptQuiz.addEventListener("click", startFinalQuiz);
  els.declineQuiz.addEventListener("click", showFarewell);
  els.resultsHome.addEventListener("click", returnToSetup);
  els.back.addEventListener("click", returnToSetup);
  els.fullscreen.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  });
  document.addEventListener("keydown", (event) => {
    if (els.presentation.classList.contains("hidden")) return;
    if (event.key === " " && state.mode === "word" && state.wordStage === "english") {
      event.preventDefault();
      revealTurkish();
    }
    if (event.key === "ArrowRight" && !els.next.disabled) next();
    if (event.key === "ArrowLeft") previous();
  });

  renderGrades();
  renderUnits();
  updateSetupSummary();
})();
