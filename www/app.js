$(function(){
	window.App = {
		employees: null,
		filter: null,
		department: "Alle",
		allFilter: function(employee){return true;},
		belongsToDepartmentFilter: function(employee){
			return employee['Department'] == App.department;
		},
        lagreAnsattTilKontaktLista: function(id) {
        var employee = _.detect(this.employees, function(emp){
           return emp['Id'] == id;
        });
  
        var contact = navigator.contacts.create();
        contact.displayName = employee.FirstName + ' ' + employee.LastName;
        contact.nickname = employee.Seniority;
  
        var tlfNummere = [1];
        tlfNummere[0] = new ContactField('Jobb', employee.MobilePhone, false);
        contact.phoneNumbers = tlfNummere;
  
        var eposter = [1];
        eposter[0] = new ContactField('Jobb', employee.Email, true);
        contact.emails = eposter;
  
        var organisasjoner = [1];
        organisasjoner[0] = new ContactOrganization(false, 'Jobb', 'Bekk', employee.Department, employee.Seniority);
        contact.organizations = organisasjoner;
  
        var bilder = [1];
        bilder[0] = new ContactField('Jobb', employee.ImageUrl , true); 
        contact.photos = bilder;
  
        var name = new ContactName();
        name.formatted = employee.FirstName + ' ' + employee.LastName;
        name.givenName = employee.FirstName;
        name.familyName = employee.LastName;
        contact.name = name;
  
        var adresser = [1];
        adresser[0] = new ContactAddress(true, 'Hjem', employee.StreetAddress + '' + employee.PostalAddress + '' + employee.PostalNr, employee.StreetAddress, 'Oslo', employee.PostalAddress, employee.PostalNr, 'Norge');
        contact.addresses = adresser;
  
        contact.save(onSaveSuccess,onSaveError);
        },
		showEmployee: function(id){
			var employee = _.detect(this.employees, function(emp){
				return emp['Id'] == id;
			});
			var template = 	'<div data-role=page data-url=employee/{{Id}}>' + 
            '<div data-role=header>' +
            '<h1>{{FirstName}} {{LastName}}' +
            '<a href="" onClick="App.lagreAnsattTilKontaktLista({{Id}}); return false;" data-icon="check" data-theme="b">Lagre</a>'
            '</div>' +
            '<div data-role=content>' +
            '<img src="{{ImageUrl}}"/>' +
            '<br /><br />' +
            '<table>' +
            '<tr>' +
            '<th scope="row">Navn:</th>' +
            '<td>{{FirstName}} {{LastName}}</td>' + 
            '</tr>' +
            '<tr>' +
            '<th scope="row">Stilling:</th>' +
            '<td>{{Seniority}}</td>' + 
            '</tr>' +
            '<tr>' +
            '<th scope="row">Avdeling:</th>' +
            '<td>{{InterestGroup}}</td>' + 
            '</tr>' +
            '<tr>' +
            '<th scope="row">Epost:</th>' +
            '<td>{{Email}}</td>' + 
            '</tr>' +
            '<tr>' +
            '<th scope="row">Telefon:</th>' +
            '<td>{{MobilePhone}}</td>' + 
            '</tr>' +
            '<tr>' +
            '<th scope="row">Adresse:</th>' +
            '<td>{{StreetAddress}}, {{PostalNr}} {{PostalAddress}}</td>' + 
            '</tr>' +
            '</table>' +
            '</div>' + 
            '</div>';
			var html = Mustache.to_html(template, employee);
			var newPage = $(html);
			newPage.appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
            $.mobile.changePage(newPage, { transition: "slideup"} );
            $.mobile.showPageLoadingMsg();
		},
		render: function(data){
			var template = 	'<li><a href="" onClick="App.showEmployee({{Id}}); return false;">' +
            '<img src="{{ImageUrl}}"/>' +
            '<h3>{{FirstName}} {{LastName}}</h3>' +
            '<p>{{Email}}</p></a></li>';
			var html = _.reduce(_.filter(data, this.filter), function(result, employee) {
				return result + Mustache.to_html(template, employee);
			}, "");
			$('#employees').html(html).listview('refresh');
		},
		init: function(){
			this.filter = this.allFilter;
			$.ajax({
				url: 'https://bekk-employees.herokuapp.com',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				error: function(){
					alert("error");
				},
				success: function(data){
					App.employees = data;
					App.render(data);
				}
			});
		}
	}
	$('.my-nav').click(function(){
		$('.ui-btn-active').removeClass('ui-btn-active');
		$(this).addClass('ui-btn-active');
		var $target = $(this).children();
		while( $target.length ) {
            $target = $target.children();
		}
		var department = $target.end().text();
		if (department == "Alle"){
			App.filter = App.allFilter;
		} else {
			App.department = department;
			App.filter = App.belongsToDepartmentFilter;
		}
		App.render(App.employees);
		return false;
	});
	App.init();
});