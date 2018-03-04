const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const deasync = require("deasync")
const request_sync = require('sync-request')

var rootUrl = "https://www.lafourchette.com";
var jsonFile = "restaurantLaFourchettePromotion.json";

function recup_fourchette() {
	
	fs.writeFileSync(jsonFile, '{"restaurantLaFourchette" : [');
	
    for (i = 0; i < listRestaurantMichelin.length; i++) {
        console.log(i);
        recherche_restaurant(i);
    }

}

//On recherche un restaurant du même nom et meme code postal, si il y en a deux on ne prend rien
function recherche_restaurant(i) {
    var refRestaurant = "";
    var unique = true;
    request({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
            'Cookie': 'datadome=AHrlqAAAAAMANf9R81nlg8EALtotww==;'
        },
        uri: 'https://www.lafourchette.com/search-refine/' + listRestaurantMichelin[i].nom.replace(/ /g, '%20'),
        method: 'GET'
    }, function(err, res, body) {
        $ = cheerio.load(body);
        $('.resultItem').each(function(d, elem) {
            //console.log($('.resultItem-name' ,elem).text().trim() + ':' + listRestaurantMichelin[i].nom);
            if ($('.resultItem-name', elem).text().includes(listRestaurantMichelin[i].nom) && $('.resultItem-address', this).text().includes(listRestaurantMichelin[i].codePostal)) {
                if (unique == true && refRestaurant != "") {
                    unique = false;
                }
                refRestaurant = $('a', elem).attr('href');
            }

        });

        if (unique == true && refRestaurant != "") {
            
            request({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                    'Cookie': 'datadome=AHrlqAAAAAMANf9R81nlg8EALtotww==;'
                },
                uri: rootUrl + refRestaurant,
                method: 'GET'
            }, function(err, res, body) {
				$1 = cheerio.load(body);
				
				var lienFourchette = rootUrl + refRestaurant;
				
				var noteLaFourchette = $1('.rating-ratingValue').first().text().trim();
				
				var nbAvisLaFourchette = $1('.reviewsCount').text().trim();
				
				var promotion = "["
				
				$1('.saleType.saleType--specialOffer').each(function(d, elem) {
					promotion = promotion + '{"intitule":"' + $1('.saleType-title',elem).text().trim() + '","description":"' + $1('p',elem).text().replace(/\n|\r|(\n\r)/g,'<br />').replace(/"/g, '') + '"},'
				});
				
				promotion = promotion.substring(0, promotion.length - 1) + ']';
				
				if(promotion == "]"){
					promotion = "[]";
				}
				
				fs.appendFileSync(jsonFile, '\n{"nom":"' + listRestaurantMichelin[i].nom + '","tranchePrix":"' + listRestaurantMichelin[i].tranchePrix + '","etoileMichelin":"' + listRestaurantMichelin[i].etoileMichelin + '","noteMichelin":"' + listRestaurantMichelin[i].noteMichelin + '","typeCuisine": "' + listRestaurantMichelin[i].typeCuisine + '","nbAvisMichelin":"' + listRestaurantMichelin[i].nbAvis + '","adresse":"' + listRestaurantMichelin[i].adresse + '","codePostal":"' + listRestaurantMichelin[i].codePostal + '","ville":"' + listRestaurantMichelin[i].ville + '","telephone":"' + listRestaurantMichelin[i].telephone + '","noteLaFourchette":"' + noteLaFourchette + '","lienFourchette":"' + lienFourchette + '","nbAvisLaFourchette":"' + nbAvisLaFourchette + '","promotionLaFourchette":' + promotion + '},');
				
				console.log(promotion);
            });
        }
    });

}


var jsonMichelin = fs.readFileSync('./restaurantMichelin.json', 'UTF-8');

var contenuMichelin = JSON.parse(jsonMichelin);

var listRestaurantMichelin = contenuMichelin.restaurantMichelin;

recup_fourchette();