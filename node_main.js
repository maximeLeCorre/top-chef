const request = require('request');
const cheerio = require('cheerio');
const deasync = require("deasync")
const request_sync = require('sync-request')

function recup_michelin(){
	var url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-"; 

	for(i = 1; i < 80 ; i++){
	
		console.log('traitement de la page' + i);

		request(url + i, function(error, response, body) {
		
			$ = cheerio.load(body);
		
			if($('div.ds-1col').length){
		
				$('div.ds-1col').has('div.poi_card-display-title').each(function(i, elem) {
				
					var nom = $('div.poi_card-display-title',this).text();
			
					var tranche_prix = $('div.poi_card-display-price', this).text();
				
					var type_cuisine = $('div.poi_card-display-cuisines', this).text();
				
					var nb_avis = $('span.poi_card-display-reviews-count', this).text();
				
					nb_avis = nb_avis.substring(1, nb_avis.indexOf(' '));
			
					if($('span',this).attr('class').indexOf('1etoile') != -1){
						var etoile = 1;
					}
					if($('span',this).attr('class').indexOf('2etoile') != -1){
						var etoile = 2;
					}
					if($('span',this).attr('class').indexOf('3etoile') != -1){
						var etoile = 3;
					}
			
					console.log('nom du retaurant : ' + nom.trim());
					console.log('tranche de prix : ' + tranche_prix.trim());
					console.log('nombre d\'etoile : ' + etoile);
					console.log('type de cuisine : ' + type_cuisine.trim());
					console.log('nombre d\'avis : ' + nb_avis); 
					console.log('');
				})
			}
		});
	
	}
}

recup_michelin();

  