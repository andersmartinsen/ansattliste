$(function(){
	window.App = {
		employees: null,
		filter: null,
		department: "Alle",
		allFilter: function(employee){return true;},
		belongsToDepartmentFilter: function(employee){
			return employee['Department'] == App.department;
		},
		showEmployee: function(id){
			var employee = _.detect(this.employees, function(emp){
				return emp['Id'] == id;
			});
			var template = 	'<div data-role=page data-url=employee/{{Id}}>' + 
            '<div data-role=header>' +
            '<h1>{{FirstName}} {{LastName}}' +
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