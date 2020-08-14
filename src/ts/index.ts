import $ from 'jquery';

import '../scss/index.scss';
import '../pug/你好，世界.txt';

console.log("%c你好，世界！", "font-size: 24px;color: #6cf;font-family: 'Microsoft YaHei';");
$.ajax({
    url: "texts/你好，世界.txt",
    success: (data) => {
        $(".lyric").html(data);
    },
    error: () => {
        $(".lyric").text("获取失败");
    }
})