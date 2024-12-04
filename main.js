// ==UserScript==
// @name         WJX-Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  a script for wjx table auto filling
// @author       Arcolaus
// @match        https://www.wjx.cn/vm/*.aspx
// @grant        none


// ==/UserScript==

(function() {
    'use strict';
    // 定义问题和答案的字典
    const answers = {
        "姓名": "",
        "学号": "",
        "专业": "",
        "手机号": "",
        "是否参与提问": "",
    };

    function getQuestionDiv(selector) {
        const questionDivs = document.querySelectorAll(selector);

        // 遍历所有问题div元素,每个div中如果有class类型为ui-input-text的div，则为填空题，否则为单选题
        for (const questionDiv of questionDivs) {
            const inputLabelDiv = questionDiv.querySelector("div.ui-input-text");
            console.log("chk")

            // 填空题
            if (inputLabelDiv) {

                // 获取问题文本field-label，根据问题文本获取答案，并在ui-input-text中的input标签中填入答案
                const question = questionDiv.querySelector("div.field-label > div.topichtml").innerText;
                const answer = getAnswer(question);
                if (answer) {
                    const input = inputLabelDiv.querySelector("input");
                    input.value = answer;
                }
            }
            // 单选题
            else {
                // 获取问题文本field-label，根据问题文本获取答案，并在ui-controlgroup column1中选择答案
                const question = questionDiv.querySelector("div.field-label > div.topichtml").innerText;
                const answer = getAnswer(question);
                if (answer) {
                    const options = questionDiv.querySelectorAll("div.ui-controlgroup.column1 > div.ui-radio");
                    for (const option of options) {
                        if (option.innerText.includes(answer)) {
                            option.click();
                        }
                    }
                }
            }
        }
    }


    // 根据answers字典正则关键词匹配问题并返回答案
    function getAnswer(question) {
        for (const key in answers) {
            if (question.includes(key)) {
                return answers[key];
            }
        }
        alert("未找到答案：" + question);
        return null;
    }


    window.onload = () => {
        console.log("问卷星自动填写脚本已启动");

        // 在页面底部添加一个输入组件，用于自定义问题和答案
        const input = document.createElement("input");
        input.placeholder = "问题:答案";
        input.style.position = "fixed";
        input.style.bottom = "20px";
        input.style.right = "200px";
        input.style.zIndex = "9999";
        input.style.padding = "10px";
        input.style.border = "none";
        input.onchange = () => {
            const [question, answer] = input.value.split(":");
            answers[question] = answer;
        };
        document.body.appendChild(input);
        // 在input组件下方添加一个按钮用于提交input中的问题和答案
        const submit = document.createElement("button");
        submit.innerText = "提交";
        submit.style.position = "fixed";
        submit.style.bottom = "20px";
        submit.style.right = "100px";
        submit.style.zIndex = "9999";
        submit.style.padding = "10px";
        submit.style.border = "none";
        submit.onclick = () => {
            const [question, answer] = input.value.split(":");
            answers[question] = answer;
            input.value = "";
        }
        document.body.appendChild(submit);

        // 在页面底部添加一个浮动组件用于展示已有的问题和答案
        const div = document.createElement("div");
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "400px";
        div.style.zIndex = "9999";
        div.style.padding = "10px";
        div.style.border = "none";
        div.style.backgroundColor = "white";
        div.style.maxHeight = "200px";
        div.style.overflowY = "auto";
        document.body.appendChild(div);


        //在div中展示answers字典,并且在answers字典内容改变时，实时更新div中的内容
        setInterval(() => {
            let content = "";
            for (const key in answers) {
                content += `${key}: ${answers[key]}\n`;
            }
            div.innerText = content;
        }, 1000);


        // 在页面底部添加一个按钮
        const button = document.createElement("button");
        button.innerText = "自动填写问卷";

        // 设置按钮的样式
        button.style.position = "fixed";
        button.style.top = "20px";
        button.style.right = "20px";
        button.style.zIndex = "9999";
        button.style.padding = "10px";
        button.style.border = "none";
        button.style.backgroundColor = "#007bff";
        button.style.color = "white";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        button.style.fontWeight = "bold";
        document.body.appendChild(button);

        // 点击按钮时填写问卷
        button.onclick = () => {
            getQuestionDiv("div.field.ui-field-contain");
            setTimeout(() => {
                document.querySelector("#ctlNext").click();
            }, 1000);
        };
    };
})();
