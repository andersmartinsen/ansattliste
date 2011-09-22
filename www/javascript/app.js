// Lag et script som kjøres når siden lastes vha. JQuery
// Lag et passende javascriptobjekt som kan holde på variablene (eks. ansatte i et JSON-objekt) og metodene du trenger
// Når siden er lastet (ready), bruker du $.ajax() til å hente alle ansatte som JSON fra /employees
// Bruk en mustache template til å generere liste-element-htmlen du trenger
// Bruk JQuery til å sette disse elementene inn i ansattlisten du lagde i index.html

// Lag en funksjon som kan vise en enkelt ansatt
// Denne må ha en template som inkluderer alt JQuery mobile forventer av en side
// Denne siden må nå legges til $.mobile.pageContainer
// Deretter må du hente den nye siden med changePage()

// Lag en funksjon som filtrerer ansattlisten din på avdeling (tech., funk osv.)
// Lag en nav-struktur i index.html som bytter mellom avdelingene
// Lytt etter click-event på nav-knappene og kall filter-funksjonen din
// Denne må så tegne ansattlisten på nytt

$(function(){
	window.EmployeeApp = {
		employees: null,
		filter: null,
		department: "Alle",
		allFilter: function(employee){return true;},
		belongsToDepartmentFilter: function(employee){
			// Sett inn kode
		},
		showEmployee: function(id){
			// Sett inn kode
		},
		renderList: function(data){
			// Sett inn kode
		},
		init: function(){
			// Sett inn kode
		}
	}
	$('.nav-button').click(function(){
		// Sett inn kode
	});
	EmployeeApp.init();
});