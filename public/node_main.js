const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const deasync = require("deasync")
const request_sync = require('sync-request')

var jsonFile = "restaurantMichelin.json";

function recup_michelin(){
	var url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-"; 
	var rootUrl = "https://restaurant.michelin.fr/";
	
	fs.writeFileSync(jsonFile, '{"restaurantMichelin" : [');
	
	for(i = 1; i < 80 ; i++){
		
		console.log('traitement de la page' + i);

		request(url + i, function(error, response, body) {
		
			$ = cheerio.load(body);
			
			//var json = $("script:contains('jQuery.extend')").val();
			
			//console.log(json);
			
			if($('div.ds-1col').length){
				
				$('div.ds-1col').has('div.poi_card-display-title').each(function(i, elem) {
				
					var arrondi_note = -1;
				
					$('li',this).each(function(i, elem) {
						
						switch($(this).attr('class').substring(0,1)){
							case 'O':
								if(arrondi_note == -1){arrondi_note = 0;}
								arrondi_note++;
								break;
							
							case 'D':
								if(arrondi_note == -1){arrondi_note = 0;}
								arrondi_note += 0.5;
								break;
								
							case 'N':
								if(arrondi_note == -1){arrondi_note = 0;}
								arrondi_note += 0;
								break;
								
							default:
								break;
						}
					})
					
					var nom = $('div.poi_card-display-title',this).text().trim().replace("\"", "").replace("\n", "").replace("\r","");
			
					var tranche_prix = $('div.poi_card-display-price', this).text().trim().replace("\"", "").replace("\n", "").replace("\r","");
				
					var type_cuisine = $('div.poi_card-display-cuisines', this).text().trim().replace("\"", "").replace("\n", "").replace("\r","");
				
					var nb_avis = $('span.poi_card-display-reviews-count', this).text();
				
					nb_avis = nb_avis.substring(0, nb_avis.indexOf(' '));
					
					if (nb_avis == ''){nb_avis = 0;}
					
					if($('span',this).attr('class').indexOf('1etoile') != -1){
						var etoile = 1;
					}
					if($('span',this).attr('class').indexOf('2etoile') != -1){
						var etoile = 2;
					}
					if($('span',this).attr('class').indexOf('3etoile') != -1){
						var etoile = 3;
					}
					var urlSuite = $('a.poi-card-link',this).attr("href");
					
					console.log(rootUrl + urlSuite);
					
					request(rootUrl + urlSuite, function(error, response, body) {
						var $1 = cheerio.load(body);
						
						try{
							var adresse = $1('div.thoroughfare')[0].children[0].data;
						}catch(err){
							var adresse = "";
						}
						
						try{
							var codePostal = $1('span.postal-code')[0].children[0].data;
						}catch(err){
							var codePostal = "";
						}
						
						try{
							var ville = $1('span.locality')[0].children[0].data;
						}catch(err){
							var ville = "";
						}
						
						var telephone = $1('.tel').text();
						
						console.log(telephone);
						
					/*console.log('nom du retaurant : ' + nom.trim());
					console.log('tranche de prix : ' + tranche_prix.trim());
					console.log('nombre d\'etoile : ' + etoile);
					console.log('type de cuisine : ' + type_cuisine.trim());
					console.log('nombre d\'avis : ' + nb_avis); 
					console.log('note : ' + arrondi_note);
					
					console.log('');*/
					
					fs.appendFileSync(jsonFile, '\n{"nom":"' + nom + '","tranchePrix":"' + tranche_prix + '","typeCuisine": "' + type_cuisine + '","nbAvis":"' + nb_avis + '","adresse":"' + adresse + '","codePostal":"' + codePostal + '","ville":"' + ville + '","telephone":"' + telephone + '"},');
					});
					
				})
			}
			
			
		});
	
	}
	console.log('ok');
}

function recup_fourchette(){
	request({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
	  'Cookie': 'datadome=AHrlqAAAAAMANf9R81nlg8EALtotww==;'
    },
    uri: 'https://www.lafourchette.com/reservation/module/date-list/73776',
    method: 'GET'
  }, function (err, res, body) {
    console.log(body);
  });
}

recup_michelin();

function writeEndFile(query, test){
	fs.appendFileSync(jsonFile, ']}');
};

  