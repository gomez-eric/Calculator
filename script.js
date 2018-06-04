$(document).ready(function() {
  var regex_operators = /[\+\-\*\=\/]+/gy; // for operators;
  var regex_mydear = /[\*\/]+/gy; // multi divide operators;
  var regex_auntsally = /[\+\-]+/gy; // add sub operators;

  var all_values = [];
  var current_value_stored = "";
  var dot_counter = true;
  var current_color = 0;

  var finished = false;

  for(var x = 0; x <= 9; x++){
    $("#" + x).click({value: x}, number_pressed);
  }

  $("body").keydown(function(e){
    //console.log(e.keyCode)
    if(e.key.match(/([0-9])+/g)){
        $("#" + e.key).click();

    }
    if (e.keyCode == 110 || e.keyCode == 190){
        $("#dot").click();
    } else if (e.keyCode == 27){
        $("#c").click();
    } else if (e.keyCode == 8){
        $("#backspace").click();
    } else if (e.keyCode == 106){
        $("#multiply").click();
    } else if (e.keyCode == 107){
        $("#add").click();
    } else if (e.keyCode == 109){
        $("#subtract").click();
    } else if (e.keyCode == 111){
        $("#divide").click();
    }  else if (e.keyCode == 13){
        $("#equal").click();
    } else if (e.keyCode == 32){
        $("#color").click();
    }
  });

  $("#dot").click({value: "."}, number_pressed);
  $("#neg").click(neg_pressed);

  $("#c").click({value: "cleare"}, function_pressed);
  $("#ce").click({value: "clear"}, function_pressed);
  $("#backspace").click({value: "backspace"}, function_pressed);

  $("#add").click({value: "+"}, operator_pressed);
  $("#subtract").click({value: "-"}, operator_pressed);
  $("#divide").click({value: "/"}, operator_pressed);
  $("#multiply").click({value: "*"}, operator_pressed);
  $("#equal").click({value: "*"}, equal_pressed);

  $("#color").click(color_changer);


//////////TO CALCULATE ARRAY////////////////////////////////////////////////
  function calculate(){
    console.log("/////CALCULATING//////")
    var total = 0;
    var temp = 0;
    var save_current = [];

    all_values.forEach((x)=>{
      save_current.push(x);
    });

    console.log(save_current);

    if(save_current[save_current.length-1].match(regex_operators)){ // removes last value if it is operator
      if(save_current[save_current.length-1].length == 1){
        save_current.splice(save_current.length-1,1);
        console.log("removed extra")
      }
    }

      for(var x = 0; x < save_current.length; x++){ // check for all multiply divide
        if(save_current[x].match(regex_mydear) != null){
          if(save_current[x].length > 1){continue;}
          var first = save_current[x-1].toString();
          var second = save_current[x+1].toString();
          if(save_current[x] == "/" && second == "0"){
            clearEverything("divide0");
            return;
          }
          console.log(save_current[x-1] + " " + save_current[x] + " " +  save_current[x+1]);

          save_current.splice(x-1, 1, check_op(first,second,save_current[x])); // replace first value;
          save_current.splice(x+1,1); // remove second value;
          save_current.splice(x,1); // remove operator;
          x--;
        }

      }

      console.log("md done: " + save_current)

      for(var x = 0; x < save_current.length; x++){ // check for all add sub
        if(save_current[x].match(regex_auntsally) != null){
          if(save_current[x].length > 1){continue;}
          var first = save_current[x-1].toString();
          var second = save_current[x+1].toString();

          console.log(save_current[x-1] + " " + save_current[x] + " " +  save_current[x+1]);

          save_current.splice(x-1, 1, check_op(first,second,save_current[x])); // replace first value;
          save_current.splice(x+1,1); // remove second value;
          save_current.splice(x,1); // remove operator;
          x--;
        }

      }

      console.log("as done: " + save_current)

    function check_op(first,second,arg){
      switch(arg) {
      case "+":
        return (parseFloat(first) + parseFloat(second)).toString();
          break;
      case "-":
          return (parseFloat(first) - parseFloat(second)).toString();
          break;
      case "*":
          return (parseFloat(first) * parseFloat(second)).toString();
          break;
      case "/":
          return (parseFloat(first) / parseFloat(second)).toString();
          break;
      default:
          Error("VALUE MISUNDERSTOOD")
          break;
      }
    }

    console.log('finished: ' + save_current);
    $("#current_value").text(save_current);


    return save_current;
  }

//////////WHEN OPERATOR IS PRESSED///////////////////////////////////////////////
  function operator_pressed(event){
    if(current_value_stored == "" && all_values.length == 0){
      current_value_stored = "0";
    }

    dot_counter = true; // RESET DOT

    if(current_value_stored == "" && all_values[all_values.length-1].match(regex_operators) != null){
      all_values[all_values.length-1] = event.data.value;
    } else {
      all_values.push(current_value_stored);
      all_values.push(event.data.value);
    }

    current_value_stored = "";

    $("#all_values").text(all_values.join(' '));

    if(all_values.length > 2){
      calculate();
    }
}

//////////WHEN NUMBER IS PRESSED/////////////////////////////////////////////////
  function number_pressed(event){
    $(event).hover();

    if(finished == true){
      clearEverything("finished");
      finished = false;
    }

    if(event.data.value == "0"){
      if (current_value_stored == "0"){
        current_value_stored = "";
      }
    }

    if(event.data.value != "0" && current_value_stored == "0"){
      current_value_stored = "";
    }

    if(event.data.value == "." && dot_counter == true){ // TURN DOT OFF
      if(current_value_stored == ""){current_value_stored += "0";}
      current_value_stored += ".";
      dot_counter = false;
      $("#current_value").text(current_value_stored);
      return;

    } else if(event.data.value == "." && dot_counter == false){ // NO PASSING
      return;
    }

    var c_v = event.data.value;
    current_value_stored += c_v;
    $("#current_value").text(current_value_stored);
  }

//////////WHEN FUNCTION IS PRESSED///////////////////////////////////////////////
  function function_pressed(event){
    if(event.data.value == "clear"){
      $("#current_value").text("0");
      current_value_stored = "";
      dot_counter = true; // RESET DOT
    }

    if(event.data.value == "backspace"){
      var current_text = $("#current_value").text();
      if(current_text[current_text.length-1] == "."){ // RESET DOT
        dot_counter = true;
      }
      current_text = current_text.slice(0, current_text.length-1);
      $("#current_value").text(current_text);
      if (current_text == ""){
        $("#current_value").text("0");
      }
      current_value_stored = current_text;
    }

    if(event.data.value == "cleare"){
      $("#current_value").text("0");
      clearEverything("none");
    }

  }

//////////WHEN EQUALFUN IS PRESSED///////////////////////////////////////////////
  function equal_pressed(event){
    if(current_value_stored == "" && all_values.length == 0){
      return;
    }

    if(current_value_stored == "" && all_values[all_values.length-1].match(regex_operators) != null){
      all_values.push((calculate()).toString());
    } else {
      all_values.push(current_value_stored);
    }
    calculate();
    $("#all_values").text(all_values.join(' '));
    all_values = [];
    current_value_stored = "";
    dot_counter = true; // RESET DOT
    finished = true;
  }

//////////CLEAR EVERYTHING///////////////////////////////////////////////////////
  function clearEverything(arg){
    $("#current_value").text();
    $("#all_values").text("0");
    if(arg == "divide0"){
      $("#current_value").text("CAN NOT DIVIDE BY 0");
    }
    all_values = [];
    current_value_stored = "";
    dot_counter = true; // RESET DOT

    if(arg == "finished"){
      $("#current_value").text("0");
      $("#all_values").text("0");

    }
  }

//////////NEGATE A NUMBER////////////////////////////////////////////////////////
  function neg_pressed(){
    if(current_value_stored == ""){
      return;
    }

    if(current_value_stored[0] == "-"){
      var tempp = current_value_stored.substr(1);
      current_value_stored = tempp.toString()
      $("#current_value").text(current_value_stored);
      return;
    }

    if(current_value_stored[0] != "-"){
      current_value_stored = "-" + current_value_stored.toString()
      $("#current_value").text(current_value_stored);
      return;
    }

  }

//////////COLOR CHANGER//////////////////////////////////////////////////////////
  function color_changer(){
    current_color++;
    var colors = [
      ["black","#1c1d1e","#75c191","#9fe1b1"],
      ["black","#584937","#dbd2ad","#a19477"],
      ["black","#1d1f1d","#8fa97f","#424f34"],
      ["black","#1d1f1d","#8fa97f","#424f34"],
      ["black","#061439","#7986AC","#162756"]
    ];
    if(current_color == colors.length){
      current_color = 0;
    }

    $(':root').css('--main-bg', colors[current_color][0]);
    $(':root').css('--main-shade', colors[current_color][1]);
    $(':root').css('--value_1', colors[current_color][2]);
    $(':root').css('--value_2', colors[current_color][3]);

  }
});
