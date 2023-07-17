function getToken() {
  const token = $option.token.trim();
  return token;
}

function isAllAlphabetWithSpace(str) {
  return /^[a-zA-Z\s]+$/.test(str);
}

function isAllAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function supportLanguages() {
  return ["auto", "zh-Hans", "en"];
}

$log.info("word-chips plugin");

async function translate(query) {
  const token = getToken();
  if (!token) {
    done(query, "请先设置Token");
  } else {
    const word = query.text.trim();
    if (isSingleWord(word) && isAllAlphabet(word)) {
      await addWord(word);
      done(query, `单词 ${word} 添加成功`);
    } else {
      done(query, "目前仅支持单个单词");
    }
  }
}

function done(query, text) {
  query.onCompletion({
    result: {
      toParagraphs: [text],
    },
  });
  $log.info(text);
}

function isSingleWord(text) {
  const arr = text.split(" ");
  $log.info(arr.length);
  return arr.length === 1;
}

async function addWord(word) {
  const token = getToken();
  await $http.request({
    method: "POST",
    url: "http://192.168.2.105:3000/userBook/addWordFromOthers",
    header: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: {
      name: word,
    },
  });
}
