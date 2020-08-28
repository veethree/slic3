// ==UserScript==
// @name         Betra_RSF
// @namespace    http://veethreedev.pythonanywhere.com/
// @version      0.1
// @description  Betra RSF.
// @author       veethreedev
// @match        https://rsf.is/markadir/limmidaprentun*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

/*
DATA-COMMAND
5: Kaupanda númer
6: Kaupanda nafn
7: Bátur nafn
8: Bátur skráninganúmer
9: Tegund
10: Stærð
11: Aldur
*/

var KAUPANDA_NR = 5;
var KAUPANDA_NAFN = 6;
var BÁTUR_NAFN = 7;
var BÁTUR_NR = 8
var TEGUNG = 9;
var STÆRÐ = 10;
var ALDUR = 11;

var SELECTED = 0

var titleColor = "rgb(46, 123, 179)";
var buttonColor = "rgb(46, 123, 179)";

var age = [
    "1-dags", "0-1 dags", "1-2 daga"
]


function createUI() {
    $("<div id='BRSF' class='container'></div>").insertAfter(".clearfix");
    $("#BRSF").append("<h4 style='text-align: center; color: " + titleColor + ";'>Betra RSF</h4><hr>");
    $("#BRSF").append("<a id='select_tub_id' class='btn btn-default' style='font-size: 18px'}>Velja stæður með karanúmerum</a>   ");
    $("#BRSF").append("<a id='select_age' class='btn btn-default' style='font-size: 18px'}>Velja 1-dags stæður</a><hr>");

    $("#BRSF").append("<h4 style='text-align: left; color: " + titleColor + ";'>Leita</h4>");
    $("#BRSF").append("<input type=text id='search_bar' style='font-size: 18px;' autocomplete='off'}>");
    $("#BRSF").append("<a id='search_button' class='btn btn-default' style='font-size: 14px'}>Velja</a>");

    $("#BRSF").append("<hr><input type='checkbox' id='select_printed' class='checkbox-inline'>");
    $("#BRSF").append("<label for='select_printed' class='checkbox-inline'>Veja prentaðar stæður?</label><hr>");

    $("#BRSF").append("<p id='notification' style='font-size: 18px; color: green'}></p>");
}

function sprint(msg) {
    $("#notification").text(msg);
}

// Afhakar allar stæður
function uncheckAll() {
    $("#check_lots").prop("checked", false);
    $(".lot_checkbox").each(function(i, e) {
        e.checked = false;
    });
    SELECTED = 0;
}

function uncheckPrinted() {
    var count = 0;
    $("#check_lots").prop("checked", false);
    $("tr[data-command]").each(function(index, element) {
       if ($(this).hasClass("printed")) {
           $(this).find(".lot_checkbox").prop("checked", false);
           count = count + 1;
           }
    });

    SELECTED = SELECTED - count;
    sprint("Valdi " + SELECTED + " stæður");
}

function getTableData() {
    var res = [[],[]];
    $("tr[data-command]").each(function(index, element) {
        var data = $(this).attr("data-command").toLowerCase();
        var split_data = data.split("||");
        res[1].push($(this));
        res[0].push(split_data);
    });
    return res
}

// Hakar við allar stæður með karanúmerum
function selectByTubId() {
    var count = 0;
    $(".glyphicon.glyphicon-info-sign").each(function(index) {
        var parent = $(this).parent().parent();
        if (!parent.hasClass("printed")) {
            parent.find(":input").prop("checked", true);
            count ++;
        }
    });
    SELECTED = count
    sprint("Valdi " + SELECTED + " stæður");
}

// Hakar við allar stæður sem eru ekki nýjar
function selectByAge() {
    var table = getTableData();
    var count = 0;
    for (var i=0; i < table[0].length; i ++) {
        var row = table[0][i]
        var element = table[1][i]
        if (row[ALDUR] !== "Nýr" && !element.hasClass("printed")) {
            element.find(".lot_checkbox").prop("checked", true);
            count ++;
        }
    }

    sprint("Valdi " + count + " stæður");
}

function selectBySearch(search_term) {
    var table = getTableData();
    search_term = search_term.toLowerCase();
    var count = 0;
    $("#search_bar").val("");
    for (var i=0; i < table[0].length; i ++) {
        var row = table[0][i]
        var element = table[1][i]
        var match = false;
        for (var j=0; j < row.length; j ++) {
            if (typeof(row[j]) == "string") {
                if (row[j].search(search_term) !== -1) {
                    match = true;
                    break
                }
            }
        }
        if (match) {
            element.find(".lot_checkbox").prop("checked", true);
            count ++;
        }
    }
    SELECTED = count;
    sprint("Valdi " + SELECTED + " stæður");
}

$(document).ready(function() {
    createUI();
    uncheckAll();

    $("#select_tub_id").click(function() {
        uncheckAll();
        selectByTubId();
    });

    $("#select_age").click(function() {
        uncheckAll();
        selectBySearch("1-dags");
        uncheckPrinted()

        alert($("#select_printed").val);
    });

    $("#search_button").click(function() {
        uncheckAll();
        selectBySearch($("#search_bar").val());
        uncheckPrinted()
    });

    //EVENT
    $("#search_bar").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault()
            uncheckAll();
            selectBySearch($("#search_bar").val());
            uncheckPrinted()
        }
    })

    console.log(getTableData());
});










