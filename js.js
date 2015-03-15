var selector = '.yt-uix-button';

/* finding rules that (partialy) match */
var rules = Array.prototype.filter.call(document.styleSheets[0].cssRules, function(item){
  return "string" === typeof item.selectorText &&
         -1 !== item.selectorText.replace(/\,/g,"||,").replace(/\s+/g,"||").indexOf(selector + "||");
});

/* extracting order is from least-to-most-effective: later rules may overwrite the first ones (just like CSS stylesheet) */
/* --- */
/* use cssText, it contains actuall styles, we don't want all default junk (all those 'initial' and 'inline' overwrite one another...) */

rules = rules.map(function(rule_styles){
  rule_styles = rule_styles.style.cssText.replace(/;\s*/g,';').replace(/;\s*$/g,'').split(';');

  var effective_style = {};

  rule_styles.forEach(function(style){
    style = style.split(':');

    var key,value;
    
    key = style.shift().trim();
    value = style.join('').trim();

    value = "NaN" === String(Number(value)) ? value : Number(value); //improve data


    effective_style[key] = value;
  });

  return effective_style;
});

//rules contains just an array of all the page's matching style-rules (even if some might overwrite one another..), now we're going to play-as-dom and overwrite the rule in the same order to figure out what the final-state is for our selector...

var effective_styles = {};
rules.forEach(function(rule_styles){
  Object.keys(rule_styles).forEach(function(key){
    effective_styles[key] = rule_styles[key];
  });
});


var final = selector + "{" + "\n";
Object.keys(effective_styles).forEach(function(key){
  final += "\t" + key + ": " + effective_styles[key] + ";" + "\n";
});
final += "}";

console.log(final);

/*
  rules               -   an array of all the rules for this selector, in the order from least-to-most significate (most is the last one, overwriting all..).
  effective_styles    -   object of all the final styles for the selector (after all of the CSS-style overwrites).
  
  final               -   taking 'selector' and 'effective_styles' and making it a CSS style-rule format.
*/
