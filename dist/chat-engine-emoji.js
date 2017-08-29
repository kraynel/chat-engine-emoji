(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//
// Dotty makes it easy to programmatically access arbitrarily nested objects and
// their properties.
//

//
// `object` is an object, `path` is the path to the property you want to check
// for existence of.
//
// `path` can be provided as either a `"string.separated.with.dots"` or as
// `["an", "array"]`.
//
// Returns `true` if the path can be completely resolved, `false` otherwise.
//

var exists = module.exports.exists = function exists(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    return Object.hasOwnProperty.apply(object, [key]);
  } else {
    return exists(object[key], path);
  }
};

//
// These arguments are the same as those for `exists`.
//
// The return value, however, is the property you're trying to access, or
// `undefined` if it can't be found. This means you won't be able to tell
// the difference between an unresolved path and an undefined property, so you 
// should not use `get` to check for the existence of a property. Use `exists`
// instead.
//

var get = module.exports.get = function get(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return;
  }

  if (path.length === 0) {
    return object[key];
  }

  if (path.length) {
    return get(object[key], path);
  }
};

//
// Arguments are similar to `exists` and `get`, with the exception that path
// components are regexes with some special cases. If a path component is `"*"`
// on its own, it'll be converted to `/.*/`.
//
// The return value is an array of values where the key path matches the
// specified criterion. If none match, an empty array will be returned.
//

var search = module.exports.search = function search(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return;
  }

  if (key === "*") {
    key = ".*";
  }

  if (typeof key === "string") {
    key = new RegExp(key);
  }

  if (path.length === 0) {
    return Object.keys(object).filter(key.test.bind(key)).map(function(k) { return object[k]; });
  } else {
    return Array.prototype.concat.apply([], Object.keys(object).filter(key.test.bind(key)).map(function(k) { return search(object[k], path); }));
  }
};

//
// The first two arguments for `put` are the same as `exists` and `get`.
//
// The third argument is a value to `put` at the `path` of the `object`.
// Objects in the middle will be created if they don't exist, or added to if
// they do. If a value is encountered in the middle of the path that is *not*
// an object, it will not be overwritten.
//
// The return value is `true` in the case that the value was `put`
// successfully, or `false` otherwise.
//

var put = module.exports.put = function put(object, path, value) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }
  
  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    object[key] = value;
  } else {
    if (typeof object[key] === "undefined") {
      object[key] = {};
    }

    if (typeof object[key] !== "object" || object[key] === null) {
      return false;
    }

    return put(object[key], path, value);
  }
};

//
// `remove` is like `put` in reverse!
//
// The return value is `true` in the case that the value existed and was removed
// successfully, or `false` otherwise.
//

var remove = module.exports.remove = function remove(object, path, value) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }
  
  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    if (!Object.hasOwnProperty.call(object, key)) {
      return false;
    }

    delete object[key];

    return true;
  } else {
    return remove(object[key], path, value);
  }
};

//
// `deepKeys` creates a list of all possible key paths for a given object.
//
// The return value is always an array, the members of which are paths in array
// format. If you want them in dot-notation format, do something like this:
//
// ```js
// dotty.deepKeys(obj).map(function(e) {
//   return e.join(".");
// });
// ```
//
// *Note: this will probably explode on recursive objects. Be careful.*
//

var deepKeys = module.exports.deepKeys = function deepKeys(object, prefix) {
  if (typeof prefix === "undefined") {
    prefix = [];
  }

  var keys = [];

  for (var k in object) {
    if (!Object.hasOwnProperty.call(object, k)) {
      continue;
    }

    keys.push(prefix.concat([k]));

    if (typeof object[k] === "object" && object[k] !== null) {
      keys = keys.concat(deepKeys(object[k], prefix.concat([k])));
    }
  }

  return keys;
};

},{}],2:[function(require,module,exports){
'use strict';

// adapted from
// https://github.com/HenrikJoreteg/emoji-images/blob/master/emoji-images.js

// list of emojii text to parse
module.exports = [':blush:', ':scream:', ':smirk:', ':smiley:', ':stuck_out_tongue_closed_eyes:', ':stuck_out_tongue_winking_eye:', ':rage:', ':disappointed:', ':sob:', ':kissing_heart:', ':wink:', ':pensive:', ':confounded:', ':flushed:', ':relaxed:', ':mask:', ':heart:', ':broken_heart:', ':sunny:', ':umbrella:', ':cloud:', ':snowflake:', ':snowman:', ':zap:', ':cyclone:', ':foggy:', ':ocean:', ':cat:', ':dog:', ':mouse:', ':hamster:', ':rabbit:', ':wolf:', ':frog:', ':tiger:', ':koala:', ':bear:', ':pig:', ':pig_nose:', ':cow:', ':boar:', ':monkey_face:', ':monkey:', ':horse:', ':racehorse:', ':camel:', ':sheep:', ':elephant:', ':panda_face:', ':snake:', ':bird:', ':baby_chick:', ':hatched_chick:', ':hatching_chick:', ':chicken:', ':penguin:', ':turtle:', ':bug:', ':honeybee:', ':ant:', ':beetle:', ':snail:', ':octopus:', ':tropical_fish:', ':fish:', ':whale:', ':whale2:', ':dolphin:', ':cow2:', ':ram:', ':rat:', ':water_buffalo:', ':tiger2:', ':rabbit2:', ':dragon:', ':goat:', ':rooster:', ':dog2:', ':pig2:', ':mouse2:', ':ox:', ':dragon_face:', ':blowfish:', ':crocodile:', ':dromedary_camel:', ':leopard:', ':cat2:', ':poodle:', ':paw_prints:', ':bouquet:', ':cherry_blossom:', ':tulip:', ':four_leaf_clover:', ':rose:', ':sunflower:', ':hibiscus:', ':maple_leaf:', ':leaves:', ':fallen_leaf:', ':herb:', ':mushroom:', ':cactus:', ':palm_tree:', ':evergreen_tree:', ':deciduous_tree:', ':chestnut:', ':seedling:', ':blossom:', ':ear_of_rice:', ':shell:', ':globe_with_meridians:', ':sun_with_face:', ':full_moon_with_face:', ':new_moon_with_face:', ':new_moon:', ':waxing_crescent_moon:', ':first_quarter_moon:', ':waxing_gibbous_moon:', ':full_moon:', ':waning_gibbous_moon:', ':last_quarter_moon:', ':waning_crescent_moon:', ':last_quarter_moon_with_face:', ':first_quarter_moon_with_face:', ':moon:', ':earth_africa:', ':earth_americas:', ':earth_asia:', ':volcano:', ':milky_way:', ':partly_sunny:', ':octocat:', ':squirrel:', ':bamboo:', ':gift_heart:', ':dolls:', ':school_satchel:', ':mortar_board:', ':flags:', ':fireworks:', ':sparkler:', ':wind_chime:', ':rice_scene:', ':jack_o_lantern:', ':ghost:', ':santa:', ':christmas_tree:', ':gift:', ':bell:', ':no_bell:', ':tanabata_tree:', ':tada:', ':confetti_ball:', ':balloon:', ':crystal_ball:', ':cd:', ':dvd:', ':floppy_disk:', ':camera:', ':video_camera:', ':movie_camera:', ':computer:', ':tv:', ':iphone:', ':phone:', ':telephone:', ':telephone_receiver:', ':pager:', ':fax:', ':minidisc:', ':vhs:', ':sound:', ':speaker:', ':mute:', ':loudspeaker:', ':mega:', ':hourglass:', ':hourglass_flowing_sand:', ':alarm_clock:', ':watch:', ':radio:', ':satellite:', ':loop:', ':mag:', ':mag_right:', ':unlock:', ':lock:', ':lock_with_ink_pen:', ':closed_lock_with_key:', ':key:', ':bulb:', ':flashlight:', ':high_brightness:', ':low_brightness:', ':electric_plug:', ':battery:', ':calling:', ':email:', ':mailbox:', ':postbox:', ':bath:', ':bathtub:', ':shower:', ':toilet:', ':wrench:', ':nut_and_bolt:', ':hammer:', ':seat:', ':moneybag:', ':yen:', ':dollar:', ':pound:', ':euro:', ':credit_card:', ':money_with_wings:', ':e-mail:', ':inbox_tray:', ':outbox_tray:', ':envelope:', ':incoming_envelope:', ':postal_horn:', ':mailbox_closed:', ':mailbox_with_mail:', ':mailbox_with_no_mail:', ':door:', ':smoking:', ':bomb:', ':gun:', ':hocho:', ':pill:', ':syringe:', ':page_facing_up:', ':page_with_curl:', ':bookmark_tabs:', ':bar_chart:', ':chart_with_upwards_trend:', ':chart_with_downwards_trend:', ':scroll:', ':clipboard:', ':calendar:', ':date:', ':card_index:', ':file_folder:', ':open_file_folder:', ':scissors:', ':pushpin:', ':paperclip:', ':black_nib:', ':pencil2:', ':straight_ruler:', ':triangular_ruler:', ':closed_book:', ':green_book:', ':blue_book:', ':orange_book:', ':notebook:', ':notebook_with_decorative_cover:', ':ledger:', ':books:', ':bookmark:', ':name_badge:', ':microscope:', ':telescope:', ':newspaper:', ':football:', ':basketball:', ':soccer:', ':baseball:', ':tennis:', ':8ball:', ':rugby_football:', ':bowling:', ':golf:', ':mountain_bicyclist:', ':bicyclist:', ':horse_racing:', ':snowboarder:', ':swimmer:', ':surfer:', ':ski:', ':spades:', ':hearts:', ':clubs:', ':diamonds:', ':gem:', ':ring:', ':trophy:', ':musical_score:', ':musical_keyboard:', ':violin:', ':space_invader:', ':video_game:', ':black_joker:', ':flower_playing_cards:', ':game_die:', ':dart:', ':mahjong:', ':clapper:', ':memo:', ':pencil:', ':book:', ':art:', ':microphone:', ':headphones:', ':trumpet:', ':saxophone:', ':guitar:', ':shoe:', ':sandal:', ':high_heel:', ':lipstick:', ':boot:', ':shirt:', ':tshirt:', ':necktie:', ':womans_clothes:', ':dress:', ':running_shirt_with_sash:', ':jeans:', ':kimono:', ':bikini:', ':ribbon:', ':tophat:', ':crown:', ':womans_hat:', ':mans_shoe:', ':closed_umbrella:', ':briefcase:', ':handbag:', ':pouch:', ':purse:', ':eyeglasses:', ':fishing_pole_and_fish:', ':coffee:', ':tea:', ':sake:', ':baby_bottle:', ':beer:', ':beers:', ':cocktail:', ':tropical_drink:', ':wine_glass:', ':fork_and_knife:', ':pizza:', ':hamburger:', ':fries:', ':poultry_leg:', ':meat_on_bone:', ':spaghetti:', ':curry:', ':fried_shrimp:', ':bento:', ':sushi:', ':fish_cake:', ':rice_ball:', ':rice_cracker:', ':rice:', ':ramen:', ':stew:', ':oden:', ':dango:', ':egg:', ':bread:', ':doughnut:', ':custard:', ':icecream:', ':ice_cream:', ':shaved_ice:', ':birthday:', ':cake:', ':cookie:', ':chocolate_bar:', ':candy:', ':lollipop:', ':honey_pot:', ':apple:', ':green_apple:', ':tangerine:', ':lemon:', ':cherries:', ':grapes:', ':watermelon:', ':strawberry:', ':peach:', ':melon:', ':banana:', ':pear:', ':pineapple:', ':sweet_potato:', ':eggplant:', ':tomato:', ':corn:', ':alien:', ':angel:', ':anger:', ':angry:', ':anguished:', ':astonished:', ':baby:', ':blue_heart:', ':blush:', ':boom:', ':bow:', ':bowtie:', ':boy:', ':bride_with_veil:', ':broken_heart:', ':bust_in_silhouette:', ':busts_in_silhouette:', ':clap:', ':cold_sweat:', ':collision:', ':confounded:', ':confused:', ':construction_worker:', ':cop:', ':couple_with_heart:', ':couple:', ':couplekiss:', ':cry:', ':crying_cat_face:', ':cupid:', ':dancer:', ':dancers:', ':dash:', ':disappointed:', ':dizzy_face:', ':dizzy:', ':droplet:', ':ear:', ':exclamation:', ':expressionless:', ':eyes:', ':facepunch:', ':family:', ':fearful:', ':feelsgood:', ':feet:', ':finnadie:', ':fire:', ':fist:', ':flushed:', ':frowning:', ':girl:', ':goberserk:', ':godmode:', ':green_heart:', ':grey_exclamation:', ':grey_question:', ':grimacing:', ':grin:', ':grinning:', ':guardsman:', ':haircut:', ':hand:', ':hankey:', ':hear_no_evil:', ':heart_eyes_cat:', ':heart_eyes:', ':heart:', ':heartbeat:', ':heartpulse:', ':hurtrealbad:', ':hushed:', ':imp:', ':information_desk_person:', ':innocent:', ':japanese_goblin:', ':japanese_ogre:', ':joy_cat:', ':joy:', ':kiss:', ':kissing_cat:', ':kissing_closed_eyes:', ':kissing_heart:', ':kissing_smiling_eyes:', ':kissing:', ':laughing:', ':lips:', ':love_letter:', ':man_with_gua_pi_mao:', ':man_with_turban:', ':man:', ':mask:', ':massage:', ':metal:', ':muscle:', ':musical_note:', ':nail_care:', ':neckbeard:', ':neutral_face:', ':no_good:', ':no_mouth:', ':nose:', ':notes:', ':ok_hand:', ':ok_woman:', ':older_man:', ':older_woman:', ':open_hands:', ':open_mouth:', ':pensive:', ':persevere:', ':person_frowning:', ':person_with_blond_hair:', ':person_with_pouting_face:', ':point_down:', ':point_left:', ':point_right:', ':point_up_2:', ':point_up:', ':poop:', ':pouting_cat:', ':pray:', ':princess:', ':punch:', ':purple_heart:', ':question:', ':rage:', ':rage1:', ':rage2:', ':rage3:', ':rage4:', ':raised_hand:', ':raised_hands:', ':relaxed:', ':relieved:', ':revolving_hearts:', ':runner:', ':running:', ':satisfied:', ':scream_cat:', ':scream:', ':see_no_evil:', ':shit:', ':skull:', ':sleeping:', ':sleepy:', ':smile_cat:', ':smile:', ':smiley_cat:', ':smiley:', ':smiling_imp:', ':smirk_cat:', ':smirk:', ':sob:', ':sparkling_heart:', ':sparkles:', ':speak_no_evil:', ':speech_balloon:', ':star:', ':star2:', ':stuck_out_tongue_closed_eyes:', ':stuck_out_tongue_winking_eye:', ':stuck_out_tongue:', ':sunglasses:', ':suspect:', ':sweat_drops:', ':sweat_smile:', ':sweat:', ':thought_balloon:', ':-1:', ':thumbsdown:', ':thumbsup:', ':+1:', ':tired_face:', ':tongue:', ':triumph:', ':trollface:', ':two_hearts:', ':two_men_holding_hands:', ':two_women_holding_hands:', ':unamused:', ':v:', ':walking:', ':wave:', ':weary:', ':wink2:', ':wink:', ':woman:', ':worried:', ':yellow_heart:', ':yum:', ':zzz:', ':109:', ':house:', ':house_with_garden:', ':school:', ':office:', ':post_office:', ':hospital:', ':bank:', ':convenience_store:', ':love_hotel:', ':hotel:', ':wedding:', ':church:', ':department_store:', ':european_post_office:', ':city_sunrise:', ':city_sunset:', ':japanese_castle:', ':european_castle:', ':tent:', ':factory:', ':tokyo_tower:', ':japan:', ':mount_fuji:', ':sunrise_over_mountains:', ':sunrise:', ':stars:', ':statue_of_liberty:', ':bridge_at_night:', ':carousel_horse:', ':rainbow:', ':ferris_wheel:', ':fountain:', ':roller_coaster:', ':ship:', ':speedboat:', ':boat:', ':sailboat:', ':rowboat:', ':anchor:', ':rocket:', ':airplane:', ':helicopter:', ':steam_locomotive:', ':tram:', ':mountain_railway:', ':bike:', ':aerial_tramway:', ':suspension_railway:', ':mountain_cableway:', ':tractor:', ':blue_car:', ':oncoming_automobile:', ':car:', ':red_car:', ':taxi:', ':oncoming_taxi:', ':articulated_lorry:', ':bus:', ':oncoming_bus:', ':rotating_light:', ':police_car:', ':oncoming_police_car:', ':fire_engine:', ':ambulance:', ':minibus:', ':truck:', ':train:', ':station:', ':train2:', ':bullettrain_front:', ':bullettrain_side:', ':light_rail:', ':monorail:', ':railway_car:', ':trolleybus:', ':ticket:', ':fuelpump:', ':vertical_traffic_light:', ':traffic_light:', ':warning:', ':construction:', ':beginner:', ':atm:', ':slot_machine:', ':busstop:', ':barber:', ':hotsprings:', ':checkered_flag:', ':crossed_flags:', ':izakaya_lantern:', ':moyai:', ':circus_tent:', ':performing_arts:', ':round_pushpin:', ':triangular_flag_on_post:', ':jp:', ':kr:', ':cn:', ':us:', ':fr:', ':es:', ':it:', ':ru:', ':gb:', ':uk:', ':de:', ':100:', ':1234:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:', ':zero:', ':hash:', ':symbols:', ':arrow_backward:', ':arrow_down:', ':arrow_forward:', ':arrow_left:', ':capital_abcd:', ':abcd:', ':abc:', ':arrow_lower_left:', ':arrow_lower_right:', ':arrow_right:', ':arrow_up:', ':arrow_upper_left:', ':arrow_upper_right:', ':arrow_double_down:', ':arrow_double_up:', ':arrow_down_small:', ':arrow_heading_down:', ':arrow_heading_up:', ':leftwards_arrow_with_hook:', ':arrow_right_hook:', ':left_right_arrow:', ':arrow_up_down:', ':arrow_up_small:', ':arrows_clockwise:', ':arrows_counterclockwise:', ':rewind:', ':fast_forward:', ':information_source:', ':ok:', ':twisted_rightwards_arrows:', ':repeat:', ':repeat_one:', ':new:', ':top:', ':up:', ':cool:', ':free:', ':ng:', ':cinema:', ':koko:', ':signal_strength:', ':u5272:', ':u5408:', ':u55b6:', ':u6307:', ':u6708:', ':u6709:', ':u6e80:', ':u7121:', ':u7533:', ':u7a7a:', ':u7981:', ':sa:', ':restroom:', ':mens:', ':womens:', ':baby_symbol:', ':no_smoking:', ':parking:', ':wheelchair:', ':metro:', ':baggage_claim:', ':accept:', ':wc:', ':potable_water:', ':put_litter_in_its_place:', ':secret:', ':congratulations:', ':m:', ':passport_control:', ':left_luggage:', ':customs:', ':ideograph_advantage:', ':cl:', ':sos:', ':id:', ':no_entry_sign:', ':underage:', ':no_mobile_phones:', ':do_not_litter:', ':non-potable_water:', ':no_bicycles:', ':no_pedestrians:', ':children_crossing:', ':no_entry:', ':eight_spoked_asterisk:', ':eight_pointed_black_star:', ':heart_decoration:', ':vs:', ':vibration_mode:', ':mobile_phone_off:', ':chart:', ':currency_exchange:', ':aries:', ':taurus:', ':gemini:', ':cancer:', ':leo:', ':virgo:', ':libra:', ':scorpius:', ':sagittarius:', ':capricorn:', ':aquarius:', ':pisces:', ':ophiuchus:', ':six_pointed_star:', ':negative_squared_cross_mark:', ':a:', ':b:', ':ab:', ':o2:', ':diamond_shape_with_a_dot_inside:', ':recycle:', ':end:', ':on:', ':soon:', ':clock1:', ':clock130:', ':clock10:', ':clock1030:', ':clock11:', ':clock1130:', ':clock12:', ':clock1230:', ':clock2:', ':clock230:', ':clock3:', ':clock330:', ':clock4:', ':clock430:', ':clock5:', ':clock530:', ':clock6:', ':clock630:', ':clock7:', ':clock730:', ':clock8:', ':clock830:', ':clock9:', ':clock930:', ':heavy_dollar_sign:', ':copyright:', ':registered:', ':tm:', ':x:', ':heavy_exclamation_mark:', ':bangbang:', ':interrobang:', ':o:', ':heavy_multiplication_x:', ':heavy_plus_sign:', ':heavy_minus_sign:', ':heavy_division_sign:', ':white_flower:', ':heavy_check_mark:', ':ballot_box_with_check:', ':radio_button:', ':link:', ':curly_loop:', ':wavy_dash:', ':part_alternation_mark:', ':trident:', ':black_square:', ':white_square:', ':white_check_mark:', ':black_square_button:', ':white_square_button:', ':black_circle:', ':white_circle:', ':red_circle:', ':large_blue_circle:', ':large_blue_diamond:', ':large_orange_diamond:', ':small_blue_diamond:', ':small_orange_diamond:', ':small_red_triangle:', ':small_red_triangle_down:', ':shipit:'];

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
* @module chat-engine-emoji
* @description  Parses emoji in ```payload.data.text```.
*/

var emojis = require('./emoji.js');
var dotty = require("dotty");

// this is an example of middleware used in our test.js
// adds some text to message before it's sent and when it's received

/**
* @function
* @ceplugin
* @requires {@link ChatEngine}
* @param {Object} config The config object
* @param {String} [prop="data.text"] The payload to search for.
* @param {String} [event="message"] The ChatEngine event that will trigger emoji parsing.
* @param {Function} config.title The title of the desktop notification
* @param {Integer} [height=16] The height of the resulting emojiß images
* @param {String} [url] The web directory where emoji images are hosted. Filename (ex: /smile.png) will be added.
* @example
*
*
* const emoji = require('./src/plugin.js');
* chat = new OCF.Chat('emoji-chat');
* chat.plugin(emoji());
* chat.on('message', (payload) => {
*     // payload.data.text == '<img class="emoji" title=":pizza:" alt="pizza" src="http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/pizza.png" height="16" />';
* });
*
* chat.emit('message', {
*     text: 'I want :pizza:'
* });
*/
module.exports = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // regular expression to find emoji strings
    var test = /:[a-z0-9_\-\+]+:/g;

    config.event = config.event || 'message';

    // where in the payload the text is
    config.prop = config.prop || 'data.text';

    config.height = config.height || 16;

    // where emoji images are hosted. filename (ex: /smile.png) will be added
    config.url = config.url || 'http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis';

    // function to parse string for :smile: and other emoji
    var emoji = function emoji(someString) {
        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : config.url;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.height;
        return someString.replace(test, function (match) {

            // use regex to find emoji and replace with html
            var result = match;

            // if text string is in list of emojis
            if (emojis.indexOf(match) !== -1) {

                // remove the : before and after
                var name = String(match).slice(1, -1);

                // return html image, using url and height supplied in
                // function
                result = '<img class="emoji" title=":' + name + ':" alt="' + name + '" src="' + url + '/' + encodeURIComponent(name) + '.png"' + (height ? ' height="' + height + '"' : '') + ' />';
            }

            return result;
        });
    };

    /**
    * Turns```:smile:``` into ```<img src="/smile.png" />```
    * @listens message
    * @listens $history.message
    * @ceextends Chat
    */
    var parseEmoji = function parseEmoji(payload, next) {

        var message = dotty.get(payload, config.prop);

        // check if this sub property exists
        if (message.length) {

            // parse emoji
            var newPayload = emoji(message, config.url, config.height);
            dotty.put(payload, config.prop, newPayload);
        }

        // continue along middleware
        next(null, payload);
    };

    // these are new methods that will be added to the extended class

    var extension = function () {
        function extension() {
            _classCallCheck(this, extension);
        }

        _createClass(extension, [{
            key: 'render',


            /**
             * Renders emoji given ```:smile:``` as input.
             * @method render
             * @ceextends Chat
             * @param  {String} string The emoji text to turn into an icon
             * @param  {String} url Root url to look for emoji images
             * @param  {Int} height Height of the emoji icons
             * @returns {String} Returns the IMG HTML for this emoji
             */
            value: function render(string, url, height) {
                return emoji(string, url, height);
            }

            /**
             * Finds partial string matches of emoji text by searching emoji db.
             * @method search
             * @ceextends Chat
             * @param  {Strings} query The partial text to search for
             * @returns {Array} An array of matching emoji strings. Call the render function to display these.
             */

        }, {
            key: 'search',
            value: function search(query) {

                var results = [];

                for (var i in emojis) {
                    if (emojis[i].substring(0, query.length) == query) {
                        results.push(emojis[i]);
                    }
                }

                return results;
            }
        }]);

        return extension;
    }();

    var result = {
        namespace: 'emoji',
        middleware: {
            on: {}
        },
        extends: {
            Chat: extension
        }
    };

    result.middleware.on[config.event] = parseEmoji;
    result.middleware.on['$history.' + config.event] = parseEmoji;

    // middleware tells the framework to use these functions when
    // messages are sent or received
    return result;
};

},{"./emoji.js":2,"dotty":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG90dHkvbGliL2luZGV4LmpzIiwic3JjL2Vtb2ppLmpzIiwic3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBRUg7O0FBRUQ7QUFDQSxhQUFLLElBQUwsRUFBVyxPQUFYO0FBRUgsS0FoQkQ7O0FBa0JBOztBQWpFOEIsUUFrRXhCLFNBbEV3QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOzs7QUFvRTFCOzs7Ozs7Ozs7QUFwRTBCLG1DQTZFbkIsTUE3RW1CLEVBNkVYLEdBN0VXLEVBNkVOLE1BN0VNLEVBNkVFO0FBQ3hCLHVCQUFPLE1BQU0sTUFBTixFQUFjLEdBQWQsRUFBbUIsTUFBbkIsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7OztBQWpGMEI7QUFBQTtBQUFBLG1DQXdGbkIsS0F4Rm1CLEVBd0ZaOztBQUVWLG9CQUFJLFVBQVUsRUFBZDs7QUFFQSxxQkFBSSxJQUFJLENBQVIsSUFBYSxNQUFiLEVBQXFCO0FBQ2pCLHdCQUFHLE9BQU8sQ0FBUCxFQUFVLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUIsTUFBTSxNQUE3QixLQUF3QyxLQUEzQyxFQUFrRDtBQUM5QyxnQ0FBUSxJQUFSLENBQWEsT0FBTyxDQUFQLENBQWI7QUFDSDtBQUNKOztBQUVELHVCQUFPLE9BQVA7QUFFSDtBQXBHeUI7O0FBQUE7QUFBQTs7QUF1RzlCLFFBQUksU0FBUztBQUNULG1CQUFXLE9BREY7QUFFVCxvQkFBWTtBQUNSLGdCQUFJO0FBREksU0FGSDtBQUtULGlCQUFTO0FBQ0wsa0JBQU07QUFERDtBQUxBLEtBQWI7O0FBVUEsV0FBTyxVQUFQLENBQWtCLEVBQWxCLENBQXFCLE9BQU8sS0FBNUIsSUFBcUMsVUFBckM7QUFDQSxXQUFPLFVBQVAsQ0FBa0IsRUFBbEIsQ0FBcUIsY0FBYyxPQUFPLEtBQTFDLElBQW1ELFVBQW5EOztBQUVBO0FBQ0E7QUFDQSxXQUFPLE1BQVA7QUFDSCxDQXZIRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL1xuLy8gRG90dHkgbWFrZXMgaXQgZWFzeSB0byBwcm9ncmFtbWF0aWNhbGx5IGFjY2VzcyBhcmJpdHJhcmlseSBuZXN0ZWQgb2JqZWN0cyBhbmRcbi8vIHRoZWlyIHByb3BlcnRpZXMuXG4vL1xuXG4vL1xuLy8gYG9iamVjdGAgaXMgYW4gb2JqZWN0LCBgcGF0aGAgaXMgdGhlIHBhdGggdG8gdGhlIHByb3BlcnR5IHlvdSB3YW50IHRvIGNoZWNrXG4vLyBmb3IgZXhpc3RlbmNlIG9mLlxuLy9cbi8vIGBwYXRoYCBjYW4gYmUgcHJvdmlkZWQgYXMgZWl0aGVyIGEgYFwic3RyaW5nLnNlcGFyYXRlZC53aXRoLmRvdHNcImAgb3IgYXNcbi8vIGBbXCJhblwiLCBcImFycmF5XCJdYC5cbi8vXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcGF0aCBjYW4gYmUgY29tcGxldGVseSByZXNvbHZlZCwgYGZhbHNlYCBvdGhlcndpc2UuXG4vL1xuXG52YXIgZXhpc3RzID0gbW9kdWxlLmV4cG9ydHMuZXhpc3RzID0gZnVuY3Rpb24gZXhpc3RzKG9iamVjdCwgcGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdChcIi5cIik7XG4gIH1cblxuICBpZiAoIShwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcGF0aCA9IHBhdGguc2xpY2UoKTtcblxuICB2YXIga2V5ID0gcGF0aC5zaGlmdCgpO1xuXG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBPYmplY3QuaGFzT3duUHJvcGVydHkuYXBwbHkob2JqZWN0LCBba2V5XSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4aXN0cyhvYmplY3Rba2V5XSwgcGF0aCk7XG4gIH1cbn07XG5cbi8vXG4vLyBUaGVzZSBhcmd1bWVudHMgYXJlIHRoZSBzYW1lIGFzIHRob3NlIGZvciBgZXhpc3RzYC5cbi8vXG4vLyBUaGUgcmV0dXJuIHZhbHVlLCBob3dldmVyLCBpcyB0aGUgcHJvcGVydHkgeW91J3JlIHRyeWluZyB0byBhY2Nlc3MsIG9yXG4vLyBgdW5kZWZpbmVkYCBpZiBpdCBjYW4ndCBiZSBmb3VuZC4gVGhpcyBtZWFucyB5b3Ugd29uJ3QgYmUgYWJsZSB0byB0ZWxsXG4vLyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGFuIHVucmVzb2x2ZWQgcGF0aCBhbmQgYW4gdW5kZWZpbmVkIHByb3BlcnR5LCBzbyB5b3UgXG4vLyBzaG91bGQgbm90IHVzZSBgZ2V0YCB0byBjaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBhIHByb3BlcnR5LiBVc2UgYGV4aXN0c2Bcbi8vIGluc3RlYWQuXG4vL1xuXG52YXIgZ2V0ID0gbW9kdWxlLmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdChcIi5cIik7XG4gIH1cblxuICBpZiAoIShwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcGF0aCA9IHBhdGguc2xpY2UoKTtcblxuICB2YXIga2V5ID0gcGF0aC5zaGlmdCgpO1xuXG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCkge1xuICAgIHJldHVybiBnZXQob2JqZWN0W2tleV0sIHBhdGgpO1xuICB9XG59O1xuXG4vL1xuLy8gQXJndW1lbnRzIGFyZSBzaW1pbGFyIHRvIGBleGlzdHNgIGFuZCBgZ2V0YCwgd2l0aCB0aGUgZXhjZXB0aW9uIHRoYXQgcGF0aFxuLy8gY29tcG9uZW50cyBhcmUgcmVnZXhlcyB3aXRoIHNvbWUgc3BlY2lhbCBjYXNlcy4gSWYgYSBwYXRoIGNvbXBvbmVudCBpcyBgXCIqXCJgXG4vLyBvbiBpdHMgb3duLCBpdCdsbCBiZSBjb252ZXJ0ZWQgdG8gYC8uKi9gLlxuLy9cbi8vIFRoZSByZXR1cm4gdmFsdWUgaXMgYW4gYXJyYXkgb2YgdmFsdWVzIHdoZXJlIHRoZSBrZXkgcGF0aCBtYXRjaGVzIHRoZVxuLy8gc3BlY2lmaWVkIGNyaXRlcmlvbi4gSWYgbm9uZSBtYXRjaCwgYW4gZW1wdHkgYXJyYXkgd2lsbCBiZSByZXR1cm5lZC5cbi8vXG5cbnZhciBzZWFyY2ggPSBtb2R1bGUuZXhwb3J0cy5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2gob2JqZWN0LCBwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHBhdGggPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgfVxuXG4gIGlmICghKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwYXRoID0gcGF0aC5zbGljZSgpO1xuXG4gIHZhciBrZXkgPSBwYXRoLnNoaWZ0KCk7XG5cbiAgaWYgKHR5cGVvZiBvYmplY3QgIT09IFwib2JqZWN0XCIgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGtleSA9PT0gXCIqXCIpIHtcbiAgICBrZXkgPSBcIi4qXCI7XG4gIH1cblxuICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGtleSA9IG5ldyBSZWdFeHAoa2V5KTtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLmZpbHRlcihrZXkudGVzdC5iaW5kKGtleSkpLm1hcChmdW5jdGlvbihrKSB7IHJldHVybiBvYmplY3Rba107IH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBPYmplY3Qua2V5cyhvYmplY3QpLmZpbHRlcihrZXkudGVzdC5iaW5kKGtleSkpLm1hcChmdW5jdGlvbihrKSB7IHJldHVybiBzZWFyY2gob2JqZWN0W2tdLCBwYXRoKTsgfSkpO1xuICB9XG59O1xuXG4vL1xuLy8gVGhlIGZpcnN0IHR3byBhcmd1bWVudHMgZm9yIGBwdXRgIGFyZSB0aGUgc2FtZSBhcyBgZXhpc3RzYCBhbmQgYGdldGAuXG4vL1xuLy8gVGhlIHRoaXJkIGFyZ3VtZW50IGlzIGEgdmFsdWUgdG8gYHB1dGAgYXQgdGhlIGBwYXRoYCBvZiB0aGUgYG9iamVjdGAuXG4vLyBPYmplY3RzIGluIHRoZSBtaWRkbGUgd2lsbCBiZSBjcmVhdGVkIGlmIHRoZXkgZG9uJ3QgZXhpc3QsIG9yIGFkZGVkIHRvIGlmXG4vLyB0aGV5IGRvLiBJZiBhIHZhbHVlIGlzIGVuY291bnRlcmVkIGluIHRoZSBtaWRkbGUgb2YgdGhlIHBhdGggdGhhdCBpcyAqbm90KlxuLy8gYW4gb2JqZWN0LCBpdCB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbi5cbi8vXG4vLyBUaGUgcmV0dXJuIHZhbHVlIGlzIGB0cnVlYCBpbiB0aGUgY2FzZSB0aGF0IHRoZSB2YWx1ZSB3YXMgYHB1dGBcbi8vIHN1Y2Nlc3NmdWxseSwgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4vL1xuXG52YXIgcHV0ID0gbW9kdWxlLmV4cG9ydHMucHV0ID0gZnVuY3Rpb24gcHV0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSB7XG4gICAgcGF0aCA9IHBhdGguc3BsaXQoXCIuXCIpO1xuICB9XG5cbiAgaWYgKCEocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgcGF0aCA9IHBhdGguc2xpY2UoKTtcblxuICB2YXIga2V5ID0gcGF0aC5zaGlmdCgpO1xuXG4gIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdFtrZXldICE9PSBcIm9iamVjdFwiIHx8IG9iamVjdFtrZXldID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1dChvYmplY3Rba2V5XSwgcGF0aCwgdmFsdWUpO1xuICB9XG59O1xuXG4vL1xuLy8gYHJlbW92ZWAgaXMgbGlrZSBgcHV0YCBpbiByZXZlcnNlIVxuLy9cbi8vIFRoZSByZXR1cm4gdmFsdWUgaXMgYHRydWVgIGluIHRoZSBjYXNlIHRoYXQgdGhlIHZhbHVlIGV4aXN0ZWQgYW5kIHdhcyByZW1vdmVkXG4vLyBzdWNjZXNzZnVsbHksIG9yIGBmYWxzZWAgb3RoZXJ3aXNlLlxuLy9cblxudmFyIHJlbW92ZSA9IG1vZHVsZS5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHBhdGggPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgfVxuXG4gIGlmICghKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIHBhdGggPSBwYXRoLnNsaWNlKCk7XG5cbiAgdmFyIGtleSA9IHBhdGguc2hpZnQoKTtcblxuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBvYmplY3QgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoIU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZW1vdmUob2JqZWN0W2tleV0sIHBhdGgsIHZhbHVlKTtcbiAgfVxufTtcblxuLy9cbi8vIGBkZWVwS2V5c2AgY3JlYXRlcyBhIGxpc3Qgb2YgYWxsIHBvc3NpYmxlIGtleSBwYXRocyBmb3IgYSBnaXZlbiBvYmplY3QuXG4vL1xuLy8gVGhlIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgYW4gYXJyYXksIHRoZSBtZW1iZXJzIG9mIHdoaWNoIGFyZSBwYXRocyBpbiBhcnJheVxuLy8gZm9ybWF0LiBJZiB5b3Ugd2FudCB0aGVtIGluIGRvdC1ub3RhdGlvbiBmb3JtYXQsIGRvIHNvbWV0aGluZyBsaWtlIHRoaXM6XG4vL1xuLy8gYGBganNcbi8vIGRvdHR5LmRlZXBLZXlzKG9iaikubWFwKGZ1bmN0aW9uKGUpIHtcbi8vICAgcmV0dXJuIGUuam9pbihcIi5cIik7XG4vLyB9KTtcbi8vIGBgYFxuLy9cbi8vICpOb3RlOiB0aGlzIHdpbGwgcHJvYmFibHkgZXhwbG9kZSBvbiByZWN1cnNpdmUgb2JqZWN0cy4gQmUgY2FyZWZ1bC4qXG4vL1xuXG52YXIgZGVlcEtleXMgPSBtb2R1bGUuZXhwb3J0cy5kZWVwS2V5cyA9IGZ1bmN0aW9uIGRlZXBLZXlzKG9iamVjdCwgcHJlZml4KSB7XG4gIGlmICh0eXBlb2YgcHJlZml4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcHJlZml4ID0gW107XG4gIH1cblxuICB2YXIga2V5cyA9IFtdO1xuXG4gIGZvciAodmFyIGsgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBrZXlzLnB1c2gocHJlZml4LmNvbmNhdChba10pKTtcblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tdID09PSBcIm9iamVjdFwiICYmIG9iamVjdFtrXSAhPT0gbnVsbCkge1xuICAgICAga2V5cyA9IGtleXMuY29uY2F0KGRlZXBLZXlzKG9iamVjdFtrXSwgcHJlZml4LmNvbmNhdChba10pKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLy8gYWRhcHRlZCBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vSGVucmlrSm9yZXRlZy9lbW9qaS1pbWFnZXMvYmxvYi9tYXN0ZXIvZW1vamktaW1hZ2VzLmpzXG5cbi8vIGxpc3Qgb2YgZW1vamlpIHRleHQgdG8gcGFyc2Vcbm1vZHVsZS5leHBvcnRzID0gWyc6Ymx1c2g6JywgJzpzY3JlYW06JywgJzpzbWlyazonLCAnOnNtaWxleTonLFxuJzpzdHVja19vdXRfdG9uZ3VlX2Nsb3NlZF9leWVzOicsICc6c3R1Y2tfb3V0X3Rvbmd1ZV93aW5raW5nX2V5ZTonLFxuJzpyYWdlOicsICc6ZGlzYXBwb2ludGVkOicsICc6c29iOicsICc6a2lzc2luZ19oZWFydDonLCAnOndpbms6Jyxcbic6cGVuc2l2ZTonLCAnOmNvbmZvdW5kZWQ6JywgJzpmbHVzaGVkOicsICc6cmVsYXhlZDonLCAnOm1hc2s6Jyxcbic6aGVhcnQ6JywgJzpicm9rZW5faGVhcnQ6JywgJzpzdW5ueTonLCAnOnVtYnJlbGxhOicsICc6Y2xvdWQ6Jyxcbic6c25vd2ZsYWtlOicsICc6c25vd21hbjonLCAnOnphcDonLCAnOmN5Y2xvbmU6JywgJzpmb2dneTonLCAnOm9jZWFuOicsXG4nOmNhdDonLCAnOmRvZzonLCAnOm1vdXNlOicsICc6aGFtc3RlcjonLCAnOnJhYmJpdDonLCAnOndvbGY6JywgJzpmcm9nOicsXG4nOnRpZ2VyOicsICc6a29hbGE6JywgJzpiZWFyOicsICc6cGlnOicsICc6cGlnX25vc2U6JywgJzpjb3c6JywgJzpib2FyOicsXG4nOm1vbmtleV9mYWNlOicsICc6bW9ua2V5OicsICc6aG9yc2U6JywgJzpyYWNlaG9yc2U6JywgJzpjYW1lbDonLFxuJzpzaGVlcDonLCAnOmVsZXBoYW50OicsICc6cGFuZGFfZmFjZTonLCAnOnNuYWtlOicsICc6YmlyZDonLFxuJzpiYWJ5X2NoaWNrOicsICc6aGF0Y2hlZF9jaGljazonLCAnOmhhdGNoaW5nX2NoaWNrOicsICc6Y2hpY2tlbjonLFxuJzpwZW5ndWluOicsICc6dHVydGxlOicsICc6YnVnOicsICc6aG9uZXliZWU6JywgJzphbnQ6JywgJzpiZWV0bGU6Jyxcbic6c25haWw6JywgJzpvY3RvcHVzOicsICc6dHJvcGljYWxfZmlzaDonLCAnOmZpc2g6JywgJzp3aGFsZTonLFxuJzp3aGFsZTI6JywgJzpkb2xwaGluOicsICc6Y293MjonLCAnOnJhbTonLCAnOnJhdDonLCAnOndhdGVyX2J1ZmZhbG86Jyxcbic6dGlnZXIyOicsICc6cmFiYml0MjonLCAnOmRyYWdvbjonLCAnOmdvYXQ6JywgJzpyb29zdGVyOicsICc6ZG9nMjonLFxuJzpwaWcyOicsICc6bW91c2UyOicsICc6b3g6JywgJzpkcmFnb25fZmFjZTonLCAnOmJsb3dmaXNoOicsXG4nOmNyb2NvZGlsZTonLCAnOmRyb21lZGFyeV9jYW1lbDonLCAnOmxlb3BhcmQ6JywgJzpjYXQyOicsICc6cG9vZGxlOicsXG4nOnBhd19wcmludHM6JywgJzpib3VxdWV0OicsICc6Y2hlcnJ5X2Jsb3Nzb206JywgJzp0dWxpcDonLFxuJzpmb3VyX2xlYWZfY2xvdmVyOicsICc6cm9zZTonLCAnOnN1bmZsb3dlcjonLCAnOmhpYmlzY3VzOicsXG4nOm1hcGxlX2xlYWY6JywgJzpsZWF2ZXM6JywgJzpmYWxsZW5fbGVhZjonLCAnOmhlcmI6JywgJzptdXNocm9vbTonLFxuJzpjYWN0dXM6JywgJzpwYWxtX3RyZWU6JywgJzpldmVyZ3JlZW5fdHJlZTonLCAnOmRlY2lkdW91c190cmVlOicsXG4nOmNoZXN0bnV0OicsICc6c2VlZGxpbmc6JywgJzpibG9zc29tOicsICc6ZWFyX29mX3JpY2U6JywgJzpzaGVsbDonLFxuJzpnbG9iZV93aXRoX21lcmlkaWFuczonLCAnOnN1bl93aXRoX2ZhY2U6JywgJzpmdWxsX21vb25fd2l0aF9mYWNlOicsXG4nOm5ld19tb29uX3dpdGhfZmFjZTonLCAnOm5ld19tb29uOicsICc6d2F4aW5nX2NyZXNjZW50X21vb246Jyxcbic6Zmlyc3RfcXVhcnRlcl9tb29uOicsICc6d2F4aW5nX2dpYmJvdXNfbW9vbjonLCAnOmZ1bGxfbW9vbjonLFxuJzp3YW5pbmdfZ2liYm91c19tb29uOicsICc6bGFzdF9xdWFydGVyX21vb246JywgJzp3YW5pbmdfY3Jlc2NlbnRfbW9vbjonLFxuJzpsYXN0X3F1YXJ0ZXJfbW9vbl93aXRoX2ZhY2U6JywgJzpmaXJzdF9xdWFydGVyX21vb25fd2l0aF9mYWNlOicsXG4nOm1vb246JywgJzplYXJ0aF9hZnJpY2E6JywgJzplYXJ0aF9hbWVyaWNhczonLCAnOmVhcnRoX2FzaWE6Jyxcbic6dm9sY2FubzonLCAnOm1pbGt5X3dheTonLCAnOnBhcnRseV9zdW5ueTonLCAnOm9jdG9jYXQ6JywgJzpzcXVpcnJlbDonLFxuJzpiYW1ib286JywgJzpnaWZ0X2hlYXJ0OicsICc6ZG9sbHM6JywgJzpzY2hvb2xfc2F0Y2hlbDonLFxuJzptb3J0YXJfYm9hcmQ6JywgJzpmbGFnczonLCAnOmZpcmV3b3JrczonLCAnOnNwYXJrbGVyOicsICc6d2luZF9jaGltZTonLFxuJzpyaWNlX3NjZW5lOicsICc6amFja19vX2xhbnRlcm46JywgJzpnaG9zdDonLCAnOnNhbnRhOicsXG4nOmNocmlzdG1hc190cmVlOicsICc6Z2lmdDonLCAnOmJlbGw6JywgJzpub19iZWxsOicsICc6dGFuYWJhdGFfdHJlZTonLFxuJzp0YWRhOicsICc6Y29uZmV0dGlfYmFsbDonLCAnOmJhbGxvb246JywgJzpjcnlzdGFsX2JhbGw6JywgJzpjZDonLFxuJzpkdmQ6JywgJzpmbG9wcHlfZGlzazonLCAnOmNhbWVyYTonLCAnOnZpZGVvX2NhbWVyYTonLCAnOm1vdmllX2NhbWVyYTonLFxuJzpjb21wdXRlcjonLCAnOnR2OicsICc6aXBob25lOicsICc6cGhvbmU6JywgJzp0ZWxlcGhvbmU6Jyxcbic6dGVsZXBob25lX3JlY2VpdmVyOicsICc6cGFnZXI6JywgJzpmYXg6JywgJzptaW5pZGlzYzonLCAnOnZoczonLFxuJzpzb3VuZDonLCAnOnNwZWFrZXI6JywgJzptdXRlOicsICc6bG91ZHNwZWFrZXI6JywgJzptZWdhOicsXG4nOmhvdXJnbGFzczonLCAnOmhvdXJnbGFzc19mbG93aW5nX3NhbmQ6JywgJzphbGFybV9jbG9jazonLCAnOndhdGNoOicsXG4nOnJhZGlvOicsICc6c2F0ZWxsaXRlOicsICc6bG9vcDonLCAnOm1hZzonLCAnOm1hZ19yaWdodDonLCAnOnVubG9jazonLFxuJzpsb2NrOicsICc6bG9ja193aXRoX2lua19wZW46JywgJzpjbG9zZWRfbG9ja193aXRoX2tleTonLCAnOmtleTonLFxuJzpidWxiOicsICc6Zmxhc2hsaWdodDonLCAnOmhpZ2hfYnJpZ2h0bmVzczonLCAnOmxvd19icmlnaHRuZXNzOicsXG4nOmVsZWN0cmljX3BsdWc6JywgJzpiYXR0ZXJ5OicsICc6Y2FsbGluZzonLCAnOmVtYWlsOicsICc6bWFpbGJveDonLFxuJzpwb3N0Ym94OicsICc6YmF0aDonLCAnOmJhdGh0dWI6JywgJzpzaG93ZXI6JywgJzp0b2lsZXQ6JywgJzp3cmVuY2g6Jyxcbic6bnV0X2FuZF9ib2x0OicsICc6aGFtbWVyOicsICc6c2VhdDonLCAnOm1vbmV5YmFnOicsICc6eWVuOicsICc6ZG9sbGFyOicsXG4nOnBvdW5kOicsICc6ZXVybzonLCAnOmNyZWRpdF9jYXJkOicsICc6bW9uZXlfd2l0aF93aW5nczonLCAnOmUtbWFpbDonLFxuJzppbmJveF90cmF5OicsICc6b3V0Ym94X3RyYXk6JywgJzplbnZlbG9wZTonLCAnOmluY29taW5nX2VudmVsb3BlOicsXG4nOnBvc3RhbF9ob3JuOicsICc6bWFpbGJveF9jbG9zZWQ6JywgJzptYWlsYm94X3dpdGhfbWFpbDonLFxuJzptYWlsYm94X3dpdGhfbm9fbWFpbDonLCAnOmRvb3I6JywgJzpzbW9raW5nOicsICc6Ym9tYjonLCAnOmd1bjonLFxuJzpob2NobzonLCAnOnBpbGw6JywgJzpzeXJpbmdlOicsICc6cGFnZV9mYWNpbmdfdXA6JywgJzpwYWdlX3dpdGhfY3VybDonLFxuJzpib29rbWFya190YWJzOicsICc6YmFyX2NoYXJ0OicsICc6Y2hhcnRfd2l0aF91cHdhcmRzX3RyZW5kOicsXG4nOmNoYXJ0X3dpdGhfZG93bndhcmRzX3RyZW5kOicsICc6c2Nyb2xsOicsICc6Y2xpcGJvYXJkOicsICc6Y2FsZW5kYXI6Jyxcbic6ZGF0ZTonLCAnOmNhcmRfaW5kZXg6JywgJzpmaWxlX2ZvbGRlcjonLCAnOm9wZW5fZmlsZV9mb2xkZXI6Jyxcbic6c2Npc3NvcnM6JywgJzpwdXNocGluOicsICc6cGFwZXJjbGlwOicsICc6YmxhY2tfbmliOicsICc6cGVuY2lsMjonLFxuJzpzdHJhaWdodF9ydWxlcjonLCAnOnRyaWFuZ3VsYXJfcnVsZXI6JywgJzpjbG9zZWRfYm9vazonLCAnOmdyZWVuX2Jvb2s6Jyxcbic6Ymx1ZV9ib29rOicsICc6b3JhbmdlX2Jvb2s6JywgJzpub3RlYm9vazonLFxuJzpub3RlYm9va193aXRoX2RlY29yYXRpdmVfY292ZXI6JywgJzpsZWRnZXI6JywgJzpib29rczonLCAnOmJvb2ttYXJrOicsXG4nOm5hbWVfYmFkZ2U6JywgJzptaWNyb3Njb3BlOicsICc6dGVsZXNjb3BlOicsICc6bmV3c3BhcGVyOicsXG4nOmZvb3RiYWxsOicsICc6YmFza2V0YmFsbDonLCAnOnNvY2NlcjonLCAnOmJhc2ViYWxsOicsICc6dGVubmlzOicsXG4nOjhiYWxsOicsICc6cnVnYnlfZm9vdGJhbGw6JywgJzpib3dsaW5nOicsICc6Z29sZjonLFxuJzptb3VudGFpbl9iaWN5Y2xpc3Q6JywgJzpiaWN5Y2xpc3Q6JywgJzpob3JzZV9yYWNpbmc6JywgJzpzbm93Ym9hcmRlcjonLFxuJzpzd2ltbWVyOicsICc6c3VyZmVyOicsICc6c2tpOicsICc6c3BhZGVzOicsICc6aGVhcnRzOicsICc6Y2x1YnM6Jyxcbic6ZGlhbW9uZHM6JywgJzpnZW06JywgJzpyaW5nOicsICc6dHJvcGh5OicsICc6bXVzaWNhbF9zY29yZTonLFxuJzptdXNpY2FsX2tleWJvYXJkOicsICc6dmlvbGluOicsICc6c3BhY2VfaW52YWRlcjonLCAnOnZpZGVvX2dhbWU6Jyxcbic6YmxhY2tfam9rZXI6JywgJzpmbG93ZXJfcGxheWluZ19jYXJkczonLCAnOmdhbWVfZGllOicsICc6ZGFydDonLFxuJzptYWhqb25nOicsICc6Y2xhcHBlcjonLCAnOm1lbW86JywgJzpwZW5jaWw6JywgJzpib29rOicsICc6YXJ0OicsXG4nOm1pY3JvcGhvbmU6JywgJzpoZWFkcGhvbmVzOicsICc6dHJ1bXBldDonLCAnOnNheG9waG9uZTonLCAnOmd1aXRhcjonLFxuJzpzaG9lOicsICc6c2FuZGFsOicsICc6aGlnaF9oZWVsOicsICc6bGlwc3RpY2s6JywgJzpib290OicsICc6c2hpcnQ6Jyxcbic6dHNoaXJ0OicsICc6bmVja3RpZTonLCAnOndvbWFuc19jbG90aGVzOicsICc6ZHJlc3M6Jyxcbic6cnVubmluZ19zaGlydF93aXRoX3Nhc2g6JywgJzpqZWFuczonLCAnOmtpbW9ubzonLCAnOmJpa2luaTonLFxuJzpyaWJib246JywgJzp0b3BoYXQ6JywgJzpjcm93bjonLCAnOndvbWFuc19oYXQ6JywgJzptYW5zX3Nob2U6Jyxcbic6Y2xvc2VkX3VtYnJlbGxhOicsICc6YnJpZWZjYXNlOicsICc6aGFuZGJhZzonLCAnOnBvdWNoOicsICc6cHVyc2U6Jyxcbic6ZXllZ2xhc3NlczonLCAnOmZpc2hpbmdfcG9sZV9hbmRfZmlzaDonLCAnOmNvZmZlZTonLCAnOnRlYTonLCAnOnNha2U6Jyxcbic6YmFieV9ib3R0bGU6JywgJzpiZWVyOicsICc6YmVlcnM6JywgJzpjb2NrdGFpbDonLCAnOnRyb3BpY2FsX2RyaW5rOicsXG4nOndpbmVfZ2xhc3M6JywgJzpmb3JrX2FuZF9rbmlmZTonLCAnOnBpenphOicsICc6aGFtYnVyZ2VyOicsICc6ZnJpZXM6Jyxcbic6cG91bHRyeV9sZWc6JywgJzptZWF0X29uX2JvbmU6JywgJzpzcGFnaGV0dGk6JywgJzpjdXJyeTonLFxuJzpmcmllZF9zaHJpbXA6JywgJzpiZW50bzonLCAnOnN1c2hpOicsICc6ZmlzaF9jYWtlOicsICc6cmljZV9iYWxsOicsXG4nOnJpY2VfY3JhY2tlcjonLCAnOnJpY2U6JywgJzpyYW1lbjonLCAnOnN0ZXc6JywgJzpvZGVuOicsICc6ZGFuZ286Jyxcbic6ZWdnOicsICc6YnJlYWQ6JywgJzpkb3VnaG51dDonLCAnOmN1c3RhcmQ6JywgJzppY2VjcmVhbTonLFxuJzppY2VfY3JlYW06JywgJzpzaGF2ZWRfaWNlOicsICc6YmlydGhkYXk6JywgJzpjYWtlOicsICc6Y29va2llOicsXG4nOmNob2NvbGF0ZV9iYXI6JywgJzpjYW5keTonLCAnOmxvbGxpcG9wOicsICc6aG9uZXlfcG90OicsICc6YXBwbGU6Jyxcbic6Z3JlZW5fYXBwbGU6JywgJzp0YW5nZXJpbmU6JywgJzpsZW1vbjonLCAnOmNoZXJyaWVzOicsICc6Z3JhcGVzOicsXG4nOndhdGVybWVsb246JywgJzpzdHJhd2JlcnJ5OicsICc6cGVhY2g6JywgJzptZWxvbjonLCAnOmJhbmFuYTonLFxuJzpwZWFyOicsICc6cGluZWFwcGxlOicsICc6c3dlZXRfcG90YXRvOicsICc6ZWdncGxhbnQ6JywgJzp0b21hdG86Jyxcbic6Y29ybjonLCAnOmFsaWVuOicsICc6YW5nZWw6JywgJzphbmdlcjonLCAnOmFuZ3J5OicsICc6YW5ndWlzaGVkOicsXG4nOmFzdG9uaXNoZWQ6JywgJzpiYWJ5OicsICc6Ymx1ZV9oZWFydDonLCAnOmJsdXNoOicsICc6Ym9vbTonLCAnOmJvdzonLFxuJzpib3d0aWU6JywgJzpib3k6JywgJzpicmlkZV93aXRoX3ZlaWw6JywgJzpicm9rZW5faGVhcnQ6Jyxcbic6YnVzdF9pbl9zaWxob3VldHRlOicsICc6YnVzdHNfaW5fc2lsaG91ZXR0ZTonLCAnOmNsYXA6JywgJzpjb2xkX3N3ZWF0OicsXG4nOmNvbGxpc2lvbjonLCAnOmNvbmZvdW5kZWQ6JywgJzpjb25mdXNlZDonLCAnOmNvbnN0cnVjdGlvbl93b3JrZXI6Jyxcbic6Y29wOicsICc6Y291cGxlX3dpdGhfaGVhcnQ6JywgJzpjb3VwbGU6JywgJzpjb3VwbGVraXNzOicsICc6Y3J5OicsXG4nOmNyeWluZ19jYXRfZmFjZTonLCAnOmN1cGlkOicsICc6ZGFuY2VyOicsICc6ZGFuY2VyczonLCAnOmRhc2g6Jyxcbic6ZGlzYXBwb2ludGVkOicsICc6ZGl6enlfZmFjZTonLCAnOmRpenp5OicsICc6ZHJvcGxldDonLCAnOmVhcjonLFxuJzpleGNsYW1hdGlvbjonLCAnOmV4cHJlc3Npb25sZXNzOicsICc6ZXllczonLCAnOmZhY2VwdW5jaDonLCAnOmZhbWlseTonLFxuJzpmZWFyZnVsOicsICc6ZmVlbHNnb29kOicsICc6ZmVldDonLCAnOmZpbm5hZGllOicsICc6ZmlyZTonLCAnOmZpc3Q6Jyxcbic6Zmx1c2hlZDonLCAnOmZyb3duaW5nOicsICc6Z2lybDonLCAnOmdvYmVyc2VyazonLCAnOmdvZG1vZGU6Jyxcbic6Z3JlZW5faGVhcnQ6JywgJzpncmV5X2V4Y2xhbWF0aW9uOicsICc6Z3JleV9xdWVzdGlvbjonLCAnOmdyaW1hY2luZzonLFxuJzpncmluOicsICc6Z3Jpbm5pbmc6JywgJzpndWFyZHNtYW46JywgJzpoYWlyY3V0OicsICc6aGFuZDonLCAnOmhhbmtleTonLFxuJzpoZWFyX25vX2V2aWw6JywgJzpoZWFydF9leWVzX2NhdDonLCAnOmhlYXJ0X2V5ZXM6JywgJzpoZWFydDonLFxuJzpoZWFydGJlYXQ6JywgJzpoZWFydHB1bHNlOicsICc6aHVydHJlYWxiYWQ6JywgJzpodXNoZWQ6JywgJzppbXA6Jyxcbic6aW5mb3JtYXRpb25fZGVza19wZXJzb246JywgJzppbm5vY2VudDonLCAnOmphcGFuZXNlX2dvYmxpbjonLFxuJzpqYXBhbmVzZV9vZ3JlOicsICc6am95X2NhdDonLCAnOmpveTonLCAnOmtpc3M6JywgJzpraXNzaW5nX2NhdDonLFxuJzpraXNzaW5nX2Nsb3NlZF9leWVzOicsICc6a2lzc2luZ19oZWFydDonLCAnOmtpc3Npbmdfc21pbGluZ19leWVzOicsXG4nOmtpc3Npbmc6JywgJzpsYXVnaGluZzonLCAnOmxpcHM6JywgJzpsb3ZlX2xldHRlcjonLFxuJzptYW5fd2l0aF9ndWFfcGlfbWFvOicsICc6bWFuX3dpdGhfdHVyYmFuOicsICc6bWFuOicsICc6bWFzazonLFxuJzptYXNzYWdlOicsICc6bWV0YWw6JywgJzptdXNjbGU6JywgJzptdXNpY2FsX25vdGU6JywgJzpuYWlsX2NhcmU6Jyxcbic6bmVja2JlYXJkOicsICc6bmV1dHJhbF9mYWNlOicsICc6bm9fZ29vZDonLCAnOm5vX21vdXRoOicsICc6bm9zZTonLFxuJzpub3RlczonLCAnOm9rX2hhbmQ6JywgJzpva193b21hbjonLCAnOm9sZGVyX21hbjonLCAnOm9sZGVyX3dvbWFuOicsXG4nOm9wZW5faGFuZHM6JywgJzpvcGVuX21vdXRoOicsICc6cGVuc2l2ZTonLCAnOnBlcnNldmVyZTonLFxuJzpwZXJzb25fZnJvd25pbmc6JywgJzpwZXJzb25fd2l0aF9ibG9uZF9oYWlyOicsXG4nOnBlcnNvbl93aXRoX3BvdXRpbmdfZmFjZTonLCAnOnBvaW50X2Rvd246JywgJzpwb2ludF9sZWZ0OicsXG4nOnBvaW50X3JpZ2h0OicsICc6cG9pbnRfdXBfMjonLCAnOnBvaW50X3VwOicsICc6cG9vcDonLCAnOnBvdXRpbmdfY2F0OicsXG4nOnByYXk6JywgJzpwcmluY2VzczonLCAnOnB1bmNoOicsICc6cHVycGxlX2hlYXJ0OicsICc6cXVlc3Rpb246Jyxcbic6cmFnZTonLCAnOnJhZ2UxOicsICc6cmFnZTI6JywgJzpyYWdlMzonLCAnOnJhZ2U0OicsICc6cmFpc2VkX2hhbmQ6Jyxcbic6cmFpc2VkX2hhbmRzOicsICc6cmVsYXhlZDonLCAnOnJlbGlldmVkOicsICc6cmV2b2x2aW5nX2hlYXJ0czonLFxuJzpydW5uZXI6JywgJzpydW5uaW5nOicsICc6c2F0aXNmaWVkOicsICc6c2NyZWFtX2NhdDonLCAnOnNjcmVhbTonLFxuJzpzZWVfbm9fZXZpbDonLCAnOnNoaXQ6JywgJzpza3VsbDonLCAnOnNsZWVwaW5nOicsICc6c2xlZXB5OicsXG4nOnNtaWxlX2NhdDonLCAnOnNtaWxlOicsICc6c21pbGV5X2NhdDonLCAnOnNtaWxleTonLCAnOnNtaWxpbmdfaW1wOicsXG4nOnNtaXJrX2NhdDonLCAnOnNtaXJrOicsICc6c29iOicsICc6c3BhcmtsaW5nX2hlYXJ0OicsICc6c3BhcmtsZXM6Jyxcbic6c3BlYWtfbm9fZXZpbDonLCAnOnNwZWVjaF9iYWxsb29uOicsICc6c3RhcjonLCAnOnN0YXIyOicsXG4nOnN0dWNrX291dF90b25ndWVfY2xvc2VkX2V5ZXM6JywgJzpzdHVja19vdXRfdG9uZ3VlX3dpbmtpbmdfZXllOicsXG4nOnN0dWNrX291dF90b25ndWU6JywgJzpzdW5nbGFzc2VzOicsICc6c3VzcGVjdDonLCAnOnN3ZWF0X2Ryb3BzOicsXG4nOnN3ZWF0X3NtaWxlOicsICc6c3dlYXQ6JywgJzp0aG91Z2h0X2JhbGxvb246JywgJzotMTonLCAnOnRodW1ic2Rvd246Jyxcbic6dGh1bWJzdXA6JywgJzorMTonLCAnOnRpcmVkX2ZhY2U6JywgJzp0b25ndWU6JywgJzp0cml1bXBoOicsXG4nOnRyb2xsZmFjZTonLCAnOnR3b19oZWFydHM6JywgJzp0d29fbWVuX2hvbGRpbmdfaGFuZHM6Jyxcbic6dHdvX3dvbWVuX2hvbGRpbmdfaGFuZHM6JywgJzp1bmFtdXNlZDonLCAnOnY6JywgJzp3YWxraW5nOicsICc6d2F2ZTonLFxuJzp3ZWFyeTonLCAnOndpbmsyOicsICc6d2luazonLCAnOndvbWFuOicsICc6d29ycmllZDonLCAnOnllbGxvd19oZWFydDonLFxuJzp5dW06JywgJzp6eno6JywgJzoxMDk6JywgJzpob3VzZTonLCAnOmhvdXNlX3dpdGhfZ2FyZGVuOicsICc6c2Nob29sOicsXG4nOm9mZmljZTonLCAnOnBvc3Rfb2ZmaWNlOicsICc6aG9zcGl0YWw6JywgJzpiYW5rOicsXG4nOmNvbnZlbmllbmNlX3N0b3JlOicsICc6bG92ZV9ob3RlbDonLCAnOmhvdGVsOicsICc6d2VkZGluZzonLCAnOmNodXJjaDonLFxuJzpkZXBhcnRtZW50X3N0b3JlOicsICc6ZXVyb3BlYW5fcG9zdF9vZmZpY2U6JywgJzpjaXR5X3N1bnJpc2U6Jyxcbic6Y2l0eV9zdW5zZXQ6JywgJzpqYXBhbmVzZV9jYXN0bGU6JywgJzpldXJvcGVhbl9jYXN0bGU6JywgJzp0ZW50OicsXG4nOmZhY3Rvcnk6JywgJzp0b2t5b190b3dlcjonLCAnOmphcGFuOicsICc6bW91bnRfZnVqaTonLFxuJzpzdW5yaXNlX292ZXJfbW91bnRhaW5zOicsICc6c3VucmlzZTonLCAnOnN0YXJzOicsICc6c3RhdHVlX29mX2xpYmVydHk6Jyxcbic6YnJpZGdlX2F0X25pZ2h0OicsICc6Y2Fyb3VzZWxfaG9yc2U6JywgJzpyYWluYm93OicsICc6ZmVycmlzX3doZWVsOicsXG4nOmZvdW50YWluOicsICc6cm9sbGVyX2NvYXN0ZXI6JywgJzpzaGlwOicsICc6c3BlZWRib2F0OicsICc6Ym9hdDonLFxuJzpzYWlsYm9hdDonLCAnOnJvd2JvYXQ6JywgJzphbmNob3I6JywgJzpyb2NrZXQ6JywgJzphaXJwbGFuZTonLFxuJzpoZWxpY29wdGVyOicsICc6c3RlYW1fbG9jb21vdGl2ZTonLCAnOnRyYW06JywgJzptb3VudGFpbl9yYWlsd2F5OicsXG4nOmJpa2U6JywgJzphZXJpYWxfdHJhbXdheTonLCAnOnN1c3BlbnNpb25fcmFpbHdheTonLFxuJzptb3VudGFpbl9jYWJsZXdheTonLCAnOnRyYWN0b3I6JywgJzpibHVlX2NhcjonLCAnOm9uY29taW5nX2F1dG9tb2JpbGU6Jyxcbic6Y2FyOicsICc6cmVkX2NhcjonLCAnOnRheGk6JywgJzpvbmNvbWluZ190YXhpOicsICc6YXJ0aWN1bGF0ZWRfbG9ycnk6Jyxcbic6YnVzOicsICc6b25jb21pbmdfYnVzOicsICc6cm90YXRpbmdfbGlnaHQ6JywgJzpwb2xpY2VfY2FyOicsXG4nOm9uY29taW5nX3BvbGljZV9jYXI6JywgJzpmaXJlX2VuZ2luZTonLCAnOmFtYnVsYW5jZTonLCAnOm1pbmlidXM6Jyxcbic6dHJ1Y2s6JywgJzp0cmFpbjonLCAnOnN0YXRpb246JywgJzp0cmFpbjI6JywgJzpidWxsZXR0cmFpbl9mcm9udDonLFxuJzpidWxsZXR0cmFpbl9zaWRlOicsICc6bGlnaHRfcmFpbDonLCAnOm1vbm9yYWlsOicsICc6cmFpbHdheV9jYXI6Jyxcbic6dHJvbGxleWJ1czonLCAnOnRpY2tldDonLCAnOmZ1ZWxwdW1wOicsICc6dmVydGljYWxfdHJhZmZpY19saWdodDonLFxuJzp0cmFmZmljX2xpZ2h0OicsICc6d2FybmluZzonLCAnOmNvbnN0cnVjdGlvbjonLCAnOmJlZ2lubmVyOicsICc6YXRtOicsXG4nOnNsb3RfbWFjaGluZTonLCAnOmJ1c3N0b3A6JywgJzpiYXJiZXI6JywgJzpob3RzcHJpbmdzOicsXG4nOmNoZWNrZXJlZF9mbGFnOicsICc6Y3Jvc3NlZF9mbGFnczonLCAnOml6YWtheWFfbGFudGVybjonLCAnOm1veWFpOicsXG4nOmNpcmN1c190ZW50OicsICc6cGVyZm9ybWluZ19hcnRzOicsICc6cm91bmRfcHVzaHBpbjonLFxuJzp0cmlhbmd1bGFyX2ZsYWdfb25fcG9zdDonLCAnOmpwOicsICc6a3I6JywgJzpjbjonLCAnOnVzOicsICc6ZnI6Jyxcbic6ZXM6JywgJzppdDonLCAnOnJ1OicsICc6Z2I6JywgJzp1azonLCAnOmRlOicsICc6MTAwOicsICc6MTIzNDonLFxuJzpvbmU6JywgJzp0d286JywgJzp0aHJlZTonLCAnOmZvdXI6JywgJzpmaXZlOicsICc6c2l4OicsICc6c2V2ZW46Jyxcbic6ZWlnaHQ6JywgJzpuaW5lOicsICc6a2V5Y2FwX3RlbjonLCAnOnplcm86JywgJzpoYXNoOicsICc6c3ltYm9sczonLFxuJzphcnJvd19iYWNrd2FyZDonLCAnOmFycm93X2Rvd246JywgJzphcnJvd19mb3J3YXJkOicsICc6YXJyb3dfbGVmdDonLFxuJzpjYXBpdGFsX2FiY2Q6JywgJzphYmNkOicsICc6YWJjOicsICc6YXJyb3dfbG93ZXJfbGVmdDonLFxuJzphcnJvd19sb3dlcl9yaWdodDonLCAnOmFycm93X3JpZ2h0OicsICc6YXJyb3dfdXA6Jyxcbic6YXJyb3dfdXBwZXJfbGVmdDonLCAnOmFycm93X3VwcGVyX3JpZ2h0OicsICc6YXJyb3dfZG91YmxlX2Rvd246Jyxcbic6YXJyb3dfZG91YmxlX3VwOicsICc6YXJyb3dfZG93bl9zbWFsbDonLCAnOmFycm93X2hlYWRpbmdfZG93bjonLFxuJzphcnJvd19oZWFkaW5nX3VwOicsICc6bGVmdHdhcmRzX2Fycm93X3dpdGhfaG9vazonLCAnOmFycm93X3JpZ2h0X2hvb2s6Jyxcbic6bGVmdF9yaWdodF9hcnJvdzonLCAnOmFycm93X3VwX2Rvd246JywgJzphcnJvd191cF9zbWFsbDonLFxuJzphcnJvd3NfY2xvY2t3aXNlOicsICc6YXJyb3dzX2NvdW50ZXJjbG9ja3dpc2U6JywgJzpyZXdpbmQ6Jyxcbic6ZmFzdF9mb3J3YXJkOicsICc6aW5mb3JtYXRpb25fc291cmNlOicsICc6b2s6Jyxcbic6dHdpc3RlZF9yaWdodHdhcmRzX2Fycm93czonLCAnOnJlcGVhdDonLCAnOnJlcGVhdF9vbmU6JywgJzpuZXc6Jyxcbic6dG9wOicsICc6dXA6JywgJzpjb29sOicsICc6ZnJlZTonLCAnOm5nOicsICc6Y2luZW1hOicsICc6a29rbzonLFxuJzpzaWduYWxfc3RyZW5ndGg6JywgJzp1NTI3MjonLCAnOnU1NDA4OicsICc6dTU1YjY6JywgJzp1NjMwNzonLFxuJzp1NjcwODonLCAnOnU2NzA5OicsICc6dTZlODA6JywgJzp1NzEyMTonLCAnOnU3NTMzOicsICc6dTdhN2E6Jyxcbic6dTc5ODE6JywgJzpzYTonLCAnOnJlc3Ryb29tOicsICc6bWVuczonLCAnOndvbWVuczonLCAnOmJhYnlfc3ltYm9sOicsXG4nOm5vX3Ntb2tpbmc6JywgJzpwYXJraW5nOicsICc6d2hlZWxjaGFpcjonLCAnOm1ldHJvOicsICc6YmFnZ2FnZV9jbGFpbTonLFxuJzphY2NlcHQ6JywgJzp3YzonLCAnOnBvdGFibGVfd2F0ZXI6JywgJzpwdXRfbGl0dGVyX2luX2l0c19wbGFjZTonLFxuJzpzZWNyZXQ6JywgJzpjb25ncmF0dWxhdGlvbnM6JywgJzptOicsICc6cGFzc3BvcnRfY29udHJvbDonLFxuJzpsZWZ0X2x1Z2dhZ2U6JywgJzpjdXN0b21zOicsICc6aWRlb2dyYXBoX2FkdmFudGFnZTonLCAnOmNsOicsICc6c29zOicsXG4nOmlkOicsICc6bm9fZW50cnlfc2lnbjonLCAnOnVuZGVyYWdlOicsICc6bm9fbW9iaWxlX3Bob25lczonLFxuJzpkb19ub3RfbGl0dGVyOicsICc6bm9uLXBvdGFibGVfd2F0ZXI6JywgJzpub19iaWN5Y2xlczonLFxuJzpub19wZWRlc3RyaWFuczonLCAnOmNoaWxkcmVuX2Nyb3NzaW5nOicsICc6bm9fZW50cnk6Jyxcbic6ZWlnaHRfc3Bva2VkX2FzdGVyaXNrOicsICc6ZWlnaHRfcG9pbnRlZF9ibGFja19zdGFyOicsXG4nOmhlYXJ0X2RlY29yYXRpb246JywgJzp2czonLCAnOnZpYnJhdGlvbl9tb2RlOicsICc6bW9iaWxlX3Bob25lX29mZjonLFxuJzpjaGFydDonLCAnOmN1cnJlbmN5X2V4Y2hhbmdlOicsICc6YXJpZXM6JywgJzp0YXVydXM6JywgJzpnZW1pbmk6Jyxcbic6Y2FuY2VyOicsICc6bGVvOicsICc6dmlyZ286JywgJzpsaWJyYTonLCAnOnNjb3JwaXVzOicsICc6c2FnaXR0YXJpdXM6Jyxcbic6Y2Fwcmljb3JuOicsICc6YXF1YXJpdXM6JywgJzpwaXNjZXM6JywgJzpvcGhpdWNodXM6Jyxcbic6c2l4X3BvaW50ZWRfc3RhcjonLCAnOm5lZ2F0aXZlX3NxdWFyZWRfY3Jvc3NfbWFyazonLCAnOmE6JywgJzpiOicsXG4nOmFiOicsICc6bzI6JywgJzpkaWFtb25kX3NoYXBlX3dpdGhfYV9kb3RfaW5zaWRlOicsICc6cmVjeWNsZTonLCAnOmVuZDonLFxuJzpvbjonLCAnOnNvb246JywgJzpjbG9jazE6JywgJzpjbG9jazEzMDonLCAnOmNsb2NrMTA6JywgJzpjbG9jazEwMzA6Jyxcbic6Y2xvY2sxMTonLCAnOmNsb2NrMTEzMDonLCAnOmNsb2NrMTI6JywgJzpjbG9jazEyMzA6JywgJzpjbG9jazI6Jyxcbic6Y2xvY2syMzA6JywgJzpjbG9jazM6JywgJzpjbG9jazMzMDonLCAnOmNsb2NrNDonLCAnOmNsb2NrNDMwOicsXG4nOmNsb2NrNTonLCAnOmNsb2NrNTMwOicsICc6Y2xvY2s2OicsICc6Y2xvY2s2MzA6JywgJzpjbG9jazc6Jyxcbic6Y2xvY2s3MzA6JywgJzpjbG9jazg6JywgJzpjbG9jazgzMDonLCAnOmNsb2NrOTonLCAnOmNsb2NrOTMwOicsXG4nOmhlYXZ5X2RvbGxhcl9zaWduOicsICc6Y29weXJpZ2h0OicsICc6cmVnaXN0ZXJlZDonLCAnOnRtOicsICc6eDonLFxuJzpoZWF2eV9leGNsYW1hdGlvbl9tYXJrOicsICc6YmFuZ2Jhbmc6JywgJzppbnRlcnJvYmFuZzonLCAnOm86Jyxcbic6aGVhdnlfbXVsdGlwbGljYXRpb25feDonLCAnOmhlYXZ5X3BsdXNfc2lnbjonLCAnOmhlYXZ5X21pbnVzX3NpZ246Jyxcbic6aGVhdnlfZGl2aXNpb25fc2lnbjonLCAnOndoaXRlX2Zsb3dlcjonLCAnOmhlYXZ5X2NoZWNrX21hcms6Jyxcbic6YmFsbG90X2JveF93aXRoX2NoZWNrOicsICc6cmFkaW9fYnV0dG9uOicsICc6bGluazonLCAnOmN1cmx5X2xvb3A6Jyxcbic6d2F2eV9kYXNoOicsICc6cGFydF9hbHRlcm5hdGlvbl9tYXJrOicsICc6dHJpZGVudDonLCAnOmJsYWNrX3NxdWFyZTonLFxuJzp3aGl0ZV9zcXVhcmU6JywgJzp3aGl0ZV9jaGVja19tYXJrOicsICc6YmxhY2tfc3F1YXJlX2J1dHRvbjonLFxuJzp3aGl0ZV9zcXVhcmVfYnV0dG9uOicsICc6YmxhY2tfY2lyY2xlOicsICc6d2hpdGVfY2lyY2xlOicsXG4nOnJlZF9jaXJjbGU6JywgJzpsYXJnZV9ibHVlX2NpcmNsZTonLCAnOmxhcmdlX2JsdWVfZGlhbW9uZDonLFxuJzpsYXJnZV9vcmFuZ2VfZGlhbW9uZDonLCAnOnNtYWxsX2JsdWVfZGlhbW9uZDonLFxuJzpzbWFsbF9vcmFuZ2VfZGlhbW9uZDonLCAnOnNtYWxsX3JlZF90cmlhbmdsZTonLFxuJzpzbWFsbF9yZWRfdHJpYW5nbGVfZG93bjonLCAnOnNoaXBpdDonXTtcbiIsIi8qKlxuICpcbiogQG1vZHVsZSBjaGF0LWVuZ2luZS1lbW9qaVxuKiBAZGVzY3JpcHRpb24gIFBhcnNlcyBlbW9qaSBpbiBgYGBwYXlsb2FkLmRhdGEudGV4dGBgYC5cbiovXG5cbmNvbnN0IGVtb2ppcyA9IHJlcXVpcmUoJy4vZW1vamkuanMnKTtcbmNvbnN0IGRvdHR5ID0gcmVxdWlyZShcImRvdHR5XCIpO1xuXG4vLyB0aGlzIGlzIGFuIGV4YW1wbGUgb2YgbWlkZGxld2FyZSB1c2VkIGluIG91ciB0ZXN0LmpzXG4vLyBhZGRzIHNvbWUgdGV4dCB0byBtZXNzYWdlIGJlZm9yZSBpdCdzIHNlbnQgYW5kIHdoZW4gaXQncyByZWNlaXZlZFxuXG4vKipcbiogQGZ1bmN0aW9uXG4qIEBjZXBsdWdpblxuKiBAcmVxdWlyZXMge0BsaW5rIENoYXRFbmdpbmV9XG4qIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBvYmplY3RcbiogQHBhcmFtIHtTdHJpbmd9IFtwcm9wPVwiZGF0YS50ZXh0XCJdIFRoZSBwYXlsb2FkIHRvIHNlYXJjaCBmb3IuXG4qIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnQ9XCJtZXNzYWdlXCJdIFRoZSBDaGF0RW5naW5lIGV2ZW50IHRoYXQgd2lsbCB0cmlnZ2VyIGVtb2ppIHBhcnNpbmcuXG4qIEBwYXJhbSB7RnVuY3Rpb259IGNvbmZpZy50aXRsZSBUaGUgdGl0bGUgb2YgdGhlIGRlc2t0b3Agbm90aWZpY2F0aW9uXG4qIEBwYXJhbSB7SW50ZWdlcn0gW2hlaWdodD0xNl0gVGhlIGhlaWdodCBvZiB0aGUgcmVzdWx0aW5nIGVtb2ppw58gaW1hZ2VzXG4qIEBwYXJhbSB7U3RyaW5nfSBbdXJsXSBUaGUgd2ViIGRpcmVjdG9yeSB3aGVyZSBlbW9qaSBpbWFnZXMgYXJlIGhvc3RlZC4gRmlsZW5hbWUgKGV4OiAvc21pbGUucG5nKSB3aWxsIGJlIGFkZGVkLlxuKiBAZXhhbXBsZVxuKlxuKlxuKiBjb25zdCBlbW9qaSA9IHJlcXVpcmUoJy4vc3JjL3BsdWdpbi5qcycpO1xuKiBjaGF0ID0gbmV3IE9DRi5DaGF0KCdlbW9qaS1jaGF0Jyk7XG4qIGNoYXQucGx1Z2luKGVtb2ppKCkpO1xuKiBjaGF0Lm9uKCdtZXNzYWdlJywgKHBheWxvYWQpID0+IHtcbiogICAgIC8vIHBheWxvYWQuZGF0YS50ZXh0ID09ICc8aW1nIGNsYXNzPVwiZW1vamlcIiB0aXRsZT1cIjpwaXp6YTpcIiBhbHQ9XCJwaXp6YVwiIHNyYz1cImh0dHA6Ly93d3cud2VicGFnZWZ4LmNvbS90b29scy9lbW9qaS1jaGVhdC1zaGVldC9ncmFwaGljcy9lbW9qaXMvcGl6emEucG5nXCIgaGVpZ2h0PVwiMTZcIiAvPic7XG4qIH0pO1xuKlxuKiBjaGF0LmVtaXQoJ21lc3NhZ2UnLCB7XG4qICAgICB0ZXh0OiAnSSB3YW50IDpwaXp6YTonXG4qIH0pO1xuKi9cbm1vZHVsZS5leHBvcnRzID0gKGNvbmZpZyA9IHt9KSA9PiB7XG5cbiAgICAvLyByZWd1bGFyIGV4cHJlc3Npb24gdG8gZmluZCBlbW9qaSBzdHJpbmdzXG4gICAgY29uc3QgdGVzdCA9IC86W2EtejAtOV9cXC1cXCtdKzovZztcblxuICAgIGNvbmZpZy5ldmVudCA9IGNvbmZpZy5ldmVudCB8fCAnbWVzc2FnZSc7XG5cbiAgICAvLyB3aGVyZSBpbiB0aGUgcGF5bG9hZCB0aGUgdGV4dCBpc1xuICAgIGNvbmZpZy5wcm9wID0gY29uZmlnLnByb3AgfHwgJ2RhdGEudGV4dCc7XG5cbiAgICBjb25maWcuaGVpZ2h0ID0gY29uZmlnLmhlaWdodCB8fCAxNjtcblxuICAgIC8vIHdoZXJlIGVtb2ppIGltYWdlcyBhcmUgaG9zdGVkLiBmaWxlbmFtZSAoZXg6IC9zbWlsZS5wbmcpIHdpbGwgYmUgYWRkZWRcbiAgICBjb25maWcudXJsID0gY29uZmlnLnVybCB8fCAnaHR0cDovL3d3dy53ZWJwYWdlZnguY29tL3Rvb2xzL2Vtb2ppLWNoZWF0LXNoZWV0L2dyYXBoaWNzL2Vtb2ppcyc7XG5cbiAgICAvLyBmdW5jdGlvbiB0byBwYXJzZSBzdHJpbmcgZm9yIDpzbWlsZTogYW5kIG90aGVyIGVtb2ppXG4gICAgY29uc3QgZW1vamkgPSAoc29tZVN0cmluZywgdXJsID0gY29uZmlnLnVybCwgaGVpZ2h0ID0gY29uZmlnLmhlaWdodCkgPT4gc29tZVN0cmluZy5yZXBsYWNlKHRlc3QsIChtYXRjaCkgPT4ge1xuXG4gICAgICAgIC8vIHVzZSByZWdleCB0byBmaW5kIGVtb2ppIGFuZCByZXBsYWNlIHdpdGggaHRtbFxuICAgICAgICBsZXQgcmVzdWx0ID0gbWF0Y2g7XG5cbiAgICAgICAgLy8gaWYgdGV4dCBzdHJpbmcgaXMgaW4gbGlzdCBvZiBlbW9qaXNcbiAgICAgICAgaWYgKGVtb2ppcy5pbmRleE9mKG1hdGNoKSAhPT0gLTEpIHtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSA6IGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICAgICAgICAgIGxldCBuYW1lID0gU3RyaW5nKG1hdGNoKS5zbGljZSgxLCAtMSk7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBodG1sIGltYWdlLCB1c2luZyB1cmwgYW5kIGhlaWdodCBzdXBwbGllZCBpblxuICAgICAgICAgICAgLy8gZnVuY3Rpb25cbiAgICAgICAgICAgIHJlc3VsdCA9ICc8aW1nIGNsYXNzPVwiZW1vamlcIiB0aXRsZT1cIjonICsgbmFtZVxuICAgICAgICAgICAgICAgICsgJzpcIiBhbHQ9XCInICsgbmFtZSArICdcIiBzcmM9XCInICsgdXJsICsgJy8nXG4gICAgICAgICAgICAgICAgKyBlbmNvZGVVUklDb21wb25lbnQobmFtZSkgKyAnLnBuZ1wiJ1xuICAgICAgICAgICAgICAgICsgKGhlaWdodCA/ICgnIGhlaWdodD1cIicgKyBoZWlnaHQgKyAnXCInKSA6ICcnKVxuICAgICAgICAgICAgICAgICsgJyAvPic7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICogVHVybnNgYGA6c21pbGU6YGBgIGludG8gYGBgPGltZyBzcmM9XCIvc21pbGUucG5nXCIgLz5gYGBcbiAgICAqIEBsaXN0ZW5zIG1lc3NhZ2VcbiAgICAqIEBsaXN0ZW5zICRoaXN0b3J5Lm1lc3NhZ2VcbiAgICAqIEBjZWV4dGVuZHMgQ2hhdFxuICAgICovXG4gICAgbGV0IHBhcnNlRW1vamkgPSBmdW5jdGlvbihwYXlsb2FkLCBuZXh0KSB7XG5cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb3R0eS5nZXQocGF5bG9hZCwgY29uZmlnLnByb3ApO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgc3ViIHByb3BlcnR5IGV4aXN0c1xuICAgICAgICBpZihtZXNzYWdlLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAvLyBwYXJzZSBlbW9qaVxuICAgICAgICAgICAgbGV0IG5ld1BheWxvYWQgPSBlbW9qaShtZXNzYWdlLCBjb25maWcudXJsLCBjb25maWcuaGVpZ2h0KTtcbiAgICAgICAgICAgIGRvdHR5LnB1dChwYXlsb2FkLCBjb25maWcucHJvcCwgbmV3UGF5bG9hZCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnRpbnVlIGFsb25nIG1pZGRsZXdhcmVcbiAgICAgICAgbmV4dChudWxsLCBwYXlsb2FkKTtcblxuICAgIH07XG5cbiAgICAvLyB0aGVzZSBhcmUgbmV3IG1ldGhvZHMgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBleHRlbmRlZCBjbGFzc1xuICAgIGNsYXNzIGV4dGVuc2lvbiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbmRlcnMgZW1vamkgZ2l2ZW4gYGBgOnNtaWxlOmBgYCBhcyBpbnB1dC5cbiAgICAgICAgICogQG1ldGhvZCByZW5kZXJcbiAgICAgICAgICogQGNlZXh0ZW5kcyBDaGF0XG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc3RyaW5nIFRoZSBlbW9qaSB0ZXh0IHRvIHR1cm4gaW50byBhbiBpY29uXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFJvb3QgdXJsIHRvIGxvb2sgZm9yIGVtb2ppIGltYWdlc1xuICAgICAgICAgKiBAcGFyYW0gIHtJbnR9IGhlaWdodCBIZWlnaHQgb2YgdGhlIGVtb2ppIGljb25zXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFJldHVybnMgdGhlIElNRyBIVE1MIGZvciB0aGlzIGVtb2ppXG4gICAgICAgICAqL1xuICAgICAgICByZW5kZXIoc3RyaW5nLCB1cmwsIGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtb2ppKHN0cmluZywgdXJsLCBoZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmRzIHBhcnRpYWwgc3RyaW5nIG1hdGNoZXMgb2YgZW1vamkgdGV4dCBieSBzZWFyY2hpbmcgZW1vamkgZGIuXG4gICAgICAgICAqIEBtZXRob2Qgc2VhcmNoXG4gICAgICAgICAqIEBjZWV4dGVuZHMgQ2hhdFxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmdzfSBxdWVyeSBUaGUgcGFydGlhbCB0ZXh0IHRvIHNlYXJjaCBmb3JcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSBvZiBtYXRjaGluZyBlbW9qaSBzdHJpbmdzLiBDYWxsIHRoZSByZW5kZXIgZnVuY3Rpb24gdG8gZGlzcGxheSB0aGVzZS5cbiAgICAgICAgICovXG4gICAgICAgIHNlYXJjaChxdWVyeSkge1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gZW1vamlzKSB7XG4gICAgICAgICAgICAgICAgaWYoZW1vamlzW2ldLnN1YnN0cmluZygwLCBxdWVyeS5sZW5ndGgpID09IHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbW9qaXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgIG5hbWVzcGFjZTogJ2Vtb2ppJyxcbiAgICAgICAgbWlkZGxld2FyZToge1xuICAgICAgICAgICAgb246IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuZHM6IHtcbiAgICAgICAgICAgIENoYXQ6IGV4dGVuc2lvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0Lm1pZGRsZXdhcmUub25bY29uZmlnLmV2ZW50XSA9IHBhcnNlRW1vamk7XG4gICAgcmVzdWx0Lm1pZGRsZXdhcmUub25bJyRoaXN0b3J5LicgKyBjb25maWcuZXZlbnRdID0gcGFyc2VFbW9qaTtcblxuICAgIC8vIG1pZGRsZXdhcmUgdGVsbHMgdGhlIGZyYW1ld29yayB0byB1c2UgdGhlc2UgZnVuY3Rpb25zIHdoZW5cbiAgICAvLyBtZXNzYWdlcyBhcmUgc2VudCBvciByZWNlaXZlZFxuICAgIHJldHVybiByZXN1bHQ7XG59XG4iXX0=
