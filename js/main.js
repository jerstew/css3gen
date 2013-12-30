brCode="";
brCodeRaw="";
bsCode="";
bsCodeRaw="";
tsCode="";
rgbaCode="";
outlineCode="";
prettyCode="";
var codeFactory = {

    brEqual: 1,

    onReady: function() {
        $(".has-code").each(function() {
            codeFactory["code_"+$(this).attr("title")] = [];
            $(this).addClass($(this).attr("title"));
            });
        $(".item-heading").not(".selected").click(function() {
          codeFactory.switchProp(this);
        });
        $("#borderRadius-equal:checkbox").click(function() {
          if ( $(this).is(":checked") ) {
            $("div.borderRadius input").not("#borderRadius-equal, #borderRadius").attr("disabled","disabled");
            $("#borderRadius").removeAttr("disabled").removeClass("hide");
            codeFactory.formats(codeFactory.updateCode(this));
          } else {
            $("div.borderRadius input").not("#borderRadius-equal, #borderRadius").removeAttr("disabled");
            $("#borderRadius").attr("disabled","disabled");
            codeFactory.formats(codeFactory.updateCode(this));
          }
        });
        $("#boxShadow-inset, #rgba-background").click(function() {
          codeFactory.formats(codeFactory.updateCode(this));
        });
        $("input, select").not("input:checkbox").change(function(){
            codeFactory.formats(codeFactory.updateCode(this));
        });
    },

    switchProp: function(propSelected) {
        $(".item-heading.selected").removeClass("selected");
        $(propSelected).addClass("selected");
        var activeProp = $(propSelected).next("div").attr("title");
        codeFactory.showItAll(activeProp);
    },

    updateCode: function(thisField) {
        var parentProp = $(thisField).parents(".has-code");
        var attrId = $(thisField).attr("id");
        var attrValue = $(thisField).val();
        var propObj = {};
        propObj[attrId] = attrValue;
        $(parentProp).data(attrId, attrValue);
        $(parentProp).find(".unitPx").not(".color").each(function() {
            if ( $(this).val() === "" ) {
                $(this).not("#borderRadius").val("");
                var emptyAttr = $(this).attr("id");
                $(parentProp).data( emptyAttr, 0 );
            }
        });
        return parentProp;
    },

    showItAll: function(propertySelected) {
      if ($(".code-block").find(".code-display").length > 0){
        $(".code-display").remove();
      }
      var codeStyle = "";
      if ($("head").find("#codeStyleTag").length > 0){ 
        $("#codeStyleTag").remove();
      }
      switch (propertySelected) {
        case "borderRadius":
          prettyCode = brCode;
          codeStyle = $("<style />", {
                id  : 'codeStyleTag',
                type: 'text/css',
                html: "#example {"+ brCodeRaw +"}"
          }).appendTo("head");
        break;
        
        case "boxShadow":
          prettyCode = bsCode;
          codeStyle = $("<style />", {
                id  : 'codeStyleTag',
                type: 'text/css',
                html: "#example {"+ bsCodeRaw +"}"
          }).appendTo("head");
        break;
        
        case "textShadow":
          prettyCode = tsCode;
          codeStyle = $("<style />", {
                id  : 'codeStyleTag',
                type: 'text/css',
                html: "#example p {"+ tsCode +"}"
          }).appendTo("head");
        break;
        
        case "rgba":
          prettyCode = rgbaCode;
          codeStyle = $("<style />", {
                id  : 'codeStyleTag',
                type: 'text/css',
                html: "#example p { font-size:20px; font-weight:bold; } #example {"+ rgbaCode +"}"
          }).appendTo("head");
        break;
        
        case "outline":
          prettyCode = outlineCode;
          codeStyle = $("<style />", {
                id  : 'codeStyleTag',
                type: 'text/css',
                html: "#example {"+ outlineCode +"}"
          }).appendTo("head");
        break;
      }
      // $(".code-block code").html(prettyCode);
      // if ( $(".code-block code").is(":hidden") ) {
      //   $(".code-block code").fadeIn().css("visibility","visible");
      // }
      var codeDisplay = document.createElement('div');
      codeDisplay.className = "code-display";
      codeDisplay.innerHTML = '<pre><code data-language="css">'+prettyCode+'</code></pre>';
      Rainbow.color(codeDisplay, function() {
          document.getElementById('code-block').appendChild(codeDisplay);
      });
    },

    prefixIt: function(codeValue,moz,webkit) {
      var prefixed = "";
      if (moz === true) {
        prefixed += "-moz-"+codeValue+";\n";
      }
      if (webkit === true) {
        prefixed += "-webkit-"+codeValue+";\n";
      }
      prefixed += codeValue+";"
      return prefixed;
    },

    formats: function(fieldSet) {
        var workingProp="";
        function pxValue(unitId) {
          var eValue = (unitId !== 0 ? (unitId+"px ") : "0 ");
          return eValue;
        }

        if ( $(fieldSet).hasClass("borderRadius") ) {
          workingProp="borderRadius";
          if ( $("#borderRadius-equal").is(":checked") && $("border-radius").val() !== null ) {
            var breqpx = $(fieldSet).data("border-radius");
            var br = "border-radius: "+(breqpx !== 0 ? (breqpx+"px") : "0");
          } else {
            br = "border-radius: ";
            br += pxValue($(fieldSet).data("borderTopLeftRadius"));
            br += pxValue($(fieldSet).data("borderTopRightRadius"));
            br += pxValue($(fieldSet).data("borderBottomRightRadius"));
            br += ($(fieldSet).data("borderBottomLeftRadius") !== 0 ? ($(fieldSet).data("borderBottomLeftRadius")+"px") : "0");
          }
            brCodeRaw = br;
            brCode = codeFactory.prefixIt(br,false,true);
            currentCode = brCode;
        } else if ( $(fieldSet).hasClass("boxShadow") ) {
          workingProp="boxShadow";
          var bsinset = $("#boxShadow-inset").is(":checked") ? "inset " : "";
          var bscolor = $(fieldSet).data("boxShadow-hex");
          var bs = "box-shadow: "+ bsinset;
          bs += pxValue($(fieldSet).data("boxShadow-x"));
          bs += pxValue($(fieldSet).data("boxShadow-y"));
          bs += pxValue($(fieldSet).data("boxShadow-blur"));
          bs += pxValue($(fieldSet).data("boxShadow-spread"));
          bs += bscolor !== 0 ? "#"+(bscolor) : "#000";
          bsCodeRaw = bs;
          bsCode = codeFactory.prefixIt(bs,false,true);
          currentCode = bsCode;
        } else if ( $(fieldSet).hasClass("textShadow") ) {
          workingProp="textShadow";
          var tscolor = $(fieldSet).data("textShadow-hex");
          var ts = "text-shadow: ";
          ts += pxValue($(fieldSet).data("textShadow-x"));
          ts += pxValue($(fieldSet).data("textShadow-y"));
          ts += pxValue($(fieldSet).data("textShadow-blur"));
          ts += tscolor !== 0 ? "#"+(tscolor) : "#000";
          tsCode = codeFactory.prefixIt(ts,false,false);
          currentCode = tsCode;
        } else if ( $(fieldSet).hasClass("rgba") ) {
          workingProp="rgba";
          var rgba = "";
          var rgbaR = $(fieldSet).data("rgba-r") !== undefined ? ($(fieldSet).data("rgba-r")+", ") : " , ";
          var rgbaG = $(fieldSet).data("rgba-g") !== undefined ? ($(fieldSet).data("rgba-g")+", ") : " , ";
          var rgbaB = $(fieldSet).data("rgba-b") !== undefined ? ($(fieldSet).data("rgba-b")+", ") : " , ";
          var rgbaA = $(fieldSet).data("rgba-a") !== undefined ? ($(fieldSet).data("rgba-a")+");") : ");";
          if ( $("#rgba-background").is(":checked") ) {
            var rbgaBg = "background-color: rgba("+rgbaR+rgbaG+rgbaB+rgbaA;
            rgba += rbgaBg + "\n\n";
          }
          rgba += "color: rgba("; rgba += rgbaR; rgba += rgbaG; rgba += rgbaB; rgba += rgbaA;
          rgbaCode = rgba;
          currentCode = rgbaCode;
        } else if ( $(fieldSet).hasClass("outline") ) {
          workingProp="outline";
          var outlineColor = $(fieldSet).data("outline-hex");
          var outline = "outline: ";
          outline += pxValue($(fieldSet).data("outline-width"));
          outline += ($(fieldSet).data("outline-style") && $(fieldSet).data("outline-style") !== "undefined") ? ($(fieldSet).data("outline-style").toLowerCase()+" ") : "none ";
          outline += outlineColor !== 0 ? "#"+(outlineColor)+";" : "#000;";
          outlineCode = outline;
          currentCode = outlineCode;
        }
      codeFactory.showItAll(workingProp);
    }

}

$(document).ready(function() {
    codeFactory.onReady();
    $(".accordion").sortable({
        handle: ".item-heading"
    });
});