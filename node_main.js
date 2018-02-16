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
					
					var nom = $('div.poi_card-display-title',this).text();
			
					var tranche_prix = $('div.poi_card-display-price', this).text();
				
					var type_cuisine = $('div.poi_card-display-cuisines', this).text();
				
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
			
					console.log('nom du retaurant : ' + nom.trim());
					console.log('tranche de prix : ' + tranche_prix.trim());
					console.log('nombre d\'etoile : ' + etoile);
					console.log('type de cuisine : ' + type_cuisine.trim());
					console.log('nombre d\'avis : ' + nb_avis); 
					console.log('note : ' + arrondi_note);
					
					console.log('');
				})
			}
		});
	
	}
}

recup_michelin();

  