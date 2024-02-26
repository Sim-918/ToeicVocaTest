testNum = 0;
check_Arr = [];
click_btn = document.getElementsByClassName("click_ans");
for (i = 0; i < click_btn.length; i++) {
    click_btn[i].addEventListener("click", handleClick);
}
// user's selected answer (push)
function handleClick(event) {
    check_Arr.push(event.target.textContent);
    Total_request_data = {
        day_num,
        report_data: check_Arr
    };
}
// asynchronous
function getData() {
    fetch('/day=' + day_num + '/test=' + testNum)
        .then((response) => response.json())
        .then((data) => {
            if (data == null) {
                postUrl = '/receive_data';
                postData = JSON.stringify(Total_request_data);
                fetch(postUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: postData
                })
                    .then(response => {
                        if (response.ok) {
                            alert('채점 시작');
                            window.location.href = '/report';
                        } else {
                            alert('오류 발생');
                        }
                    })
                    .catch(error => {
                        console.error('오류 발생', error);
                    });
            }
            else {
                now_bar = document.getElementById("now_bar");
                now_bar.style.width = data['bar_len'] + '%';
                document.getElementById("topic").innerHTML = data['topic']
                for (i = 0; i < 4; i++) {
                    document.getElementById("context" + i).innerHTML = data['context'][i]
                }
                testNum = data['tmp']
            }
        });
}

// speak_func
function speak_func(text) {
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    window.speechSynthesis.speak(utterance);
}

document.getElementById('readButton').addEventListener('click', function () {
    textToRead = document.getElementById('topic').textContent;
    speak_func(textToRead);
});
