var ENV_URL = {
  dev: "http://192.168.2.8:4999",
  test: "http://192.168.2.105:4999",
  pro: "https://word-chips-api.tachikoma.online",
};

function isAllAlphabetWithSpace(str) {
  return /^[a-zA-Z\s]+$/.test(str);
}

function isAllAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function supportLanguages() {
  return ["auto", "zh-Hans", "en"];
}

function done(query, text) {
  query.onCompletion({
    result: {
      toParagraphs: [text],
    },
  });
  $log.info(text);
}

$log.info("word-chips plugin");

function callback(query) {
  return function (resp) {
    const { message = "" } = resp.data;
    done(query, message);
  };
}

async function translate(query) {
  if (!$option[$option.env + "Key"].trim()) {
    done(query, "请先设置ApiKey");
  } else {
    const word = query.text.trim();
    if (isSingleWord(word) && isAllAlphabet(word)) {
      await addWord(word, callback(query));
    } else {
      done(query, "目前仅支持单个单词");
    }
  }
}

function isSingleWord(text) {
  const arr = text.split(" ");
  return arr.length === 1;
}

async function addWord(word, handler) {
  await $http.request({
    method: "POST",
    url: `${ENV_URL[$option.env]}/userBook/addFromApiKey`,
    header: {
      "Content-Type": "application/json",
    },
    body: {
      name: word,
      apiKey: $option[$option.env + "Key"].trim(),
    },
    handler,
  });
}
