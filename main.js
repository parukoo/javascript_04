(() => {
  const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
  const title = document.querySelector('.title');
  const text = document.querySelector('.text');
  const info = document.querySelector('.info');
  const answerList = document.querySelector('.answer-list');
  const startButton = document.querySelector('.start');

  // クイズに関する情報
  const quizInfo = {
    quizzes: [],
    currentQuizIndex: 0,
    correctCount: 0
  }

  // 初期表示
  window.addEventListener('load', () => {
    reset();
  });

  // 初期化処理
  const reset = () => {
    title.textContent = 'ようこそ';
    text.textContent = '下記ボタンをクリック';
    startButton.hidden = false;
    info.hidden = true;
  }

  // クイズを開始する
  startButton.addEventListener('click', () => {
    startQuiz();
  });

  // クイズデータを取得する
  const startQuiz = () => {
    // ロード中の表示
    title.textContent = '取得中';
    text.textContent = '少々お待ちください';
    startButton.hidden = true;

    // クイズデータを取得
    fetch(API_URL)
      .then((response) => response.json())

      // クイズデータを取得したら、クイズ情報をリセットする
      .then((data) => {
        quizInfo.quizzes = data.results;
        quizInfo.currentQuizIndex = 0;
        quizInfo.correctCount = 0;
        // 取得したクイズデータをセット
        setQuiz();
      });
  }


  // クイズをセット
  const setQuiz = () => {
    // 前回の回答リストをリセット
    answerList.innerHTML = '';

    // クイズ画面 or 最終問題であれば終了画面を表示
    if (quizInfo.currentQuizIndex < quizInfo.quizzes.length) {
      let currentQuiz = quizInfo.quizzes[quizInfo.currentQuizIndex];
      makeQuiz(quizInfo.currentQuizIndex, currentQuiz);
    } else {
      finishQuiz();
    }
  }


  // クイズを作成
  const makeQuiz = (index, quiz) => {
    title.textContent = `問題${index + 1}`;
    info.hidden = false;
    document.getElementById('category').textContent = quiz.category;
    document.getElementById('difficulty').textContent = quiz.difficulty;
    text.innerHTML = quiz.question;

    // ランダムに並べた回答リスト（配列）を取得
    const answers = makeAnswers(quiz);

    answers.forEach((answer) => {
      // 回答ボタンを作成
      let answerButton = document.createElement('button');
      answerList.appendChild(answerButton);
      answerButton.innerHTML = answer;

      answerButton.addEventListener('click', (e) => {
        // 正解であれば、正答数カウントを1増やす
        if (e.target.textContent === quiz.correct_answer) {
          quizInfo.correctCount++;
        }
        // インデックスカウントを増やし、次のクイズをセット
        quizInfo.currentQuizIndex++;
        setQuiz();
      });
    });
  }


  // ランダムに並べた回答リストを作成
  const makeAnswers = (quiz) => {
    const answers = [quiz.correct_answer, ...quiz.incorrect_answers];
    return shuffle(answers);
  }

  // 配列をシャッフルする
  const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };


  // 終了画面
  const finishQuiz = () => {
    info.hidden = true;
    title.textContent = `あなたの正答数は${quizInfo.correctCount}問です。`;
    text.textContent = '再度チャレンジしたい場合は以下をクリック！！';

    // ホームへ戻るボタンを作成
    let backHomeButton = document.createElement('button');
    document.querySelector('.container').appendChild(backHomeButton);
    backHomeButton.textContent = 'ホームに戻る';

    // ホームへ戻るボタンをクリックしたら、ホームボタンを削除・初期化処理を行う
    backHomeButton.addEventListener('click', (e) => {
      backHomeButton.remove();
      reset();
    })
  }
})();