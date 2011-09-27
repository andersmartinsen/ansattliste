$(function() {
    window.App = {
        employees: [],
        filter: null,
        department: "Alle",
        allFilter: function(employee) {
            return true;
        },
        belongsToDepartmentFilter: function(employee) {
            return employee['Department'] == App.department;
        },
        lagreAnsattTilKontaktLista: function(id) {
            var employee = _.detect(this.employees,
            function(emp) {
                return emp['Id'] == id;
            });

            var contact = navigator.contacts.create();
            contact.displayName = employee.FirstName + ' ' + employee.LastName;

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
            bilder[0] = new ContactField('Jobb', employee.ImageUrl, true);
            contact.photos = bilder;

            var name = new ContactName();
            name.formatted = employee.FirstName + ' ' + employee.LastName;
            name.givenName = employee.FirstName;
            name.familyName = employee.LastName;
            contact.name = name;

            var adresser = [1];
            adresser[0] = new ContactAddress(true, 'Hjem', '', employee.StreetAddress, '', employee.PostalNr, employee.PostalAddress, 'Norge');
            contact.addresses = adresser;

            contact.save(onSuccess, onError);

            function onSuccess() {
                navigator.notification.alert('Kontakten ble lagret i adresseboka', null, 'Suksess');
            }

            function onError(contactError) {
                navigator.notification.alert('Feilkode: ' + contactError.code, null, 'En feil inntraff');
            }
        },
        showEmployee: function(id) {
            var employee = _.detect(this.employees,
            function(emp) {
                return emp['Id'] == id;
            });
            var template =
            '<div data-role="page" data-url="employee/{{Id}}" data-add-back-btn="true">' +
            	'<div data-role="header" data-position="inline">' +
            		'<h1>{{FirstName}} {{LastName}}</h1>' +
            		'<a href="" onClick="App.lagreAnsattTilKontaktLista({{Id}}); return false;" class="ui-btn-right" data-role="button" data-icon="check">Save</a>' +
            	'</div>' +
            	'<div data-role=content>' +
            		'<img src="{{ImageUrl}}"/>' +
            		'<br /><br />' +
            		'<table class="ansatt">' +
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
            				'<td>{{Department}}</td>' +
            			'</tr>' +
            			'<tr>' +
            				'<th scope="row">Faggruppe:</th>' +
            				'<td>{{InterestGroup}}</td>' +
            			'</tr>' +
            			'<tr>' +
				            '<th scope="row">Epost:</th>' +
				            '<td><a href="mailto:{{Email}}">{{Email}}</a></td>' +
            			'</tr>' +
            			'<tr>' +
            				'<th scope="row">Telefon:</th>' +
            				'<td><a href="tel:{{MobilePhone}}">{{MobilePhone}}</a></td>' +
            			'</tr>' +
            			'<tr>' +
            				'<th scope="row">Adresse:</th>' +
            				'<td>{{StreetAddress}}, {{PostalNr}} {{PostalAddress}}</td>' +
            				'</tr>' +
            		'</table>' +
            	'</div>' +
				'<div data-role="footer" data-position="fixed">' +
		              '<div data-role="navbar">' + 
		                  '<ul>' +
		                      '<li><a href="" class="ui-btn-active">Alle</a></li>' +
		                      '<li><a href="">Avdeling</a></li>' + 
		                      '<li><a href="">Faggruppe</a></li>' + 
		                      '<li><a href="">Favoritter</a></li>' + 
		                  '</ul>' + 
		              '</div>' + 
		          '</div>' +
            '</div>';
            var html = Mustache.to_html(template, employee);
            var newPage = $(html);
            newPage.appendTo($.mobile.pageContainer);
            $.mobile.changePage(newPage);
        },
        render: function(data) {
            var template = '<li><a href="" onClick="App.showEmployee({{Id}}); return false;">' +
            '<img src="{{ImageUrl}}"/>' +
            '<h3>{{FirstName}} {{LastName}}</h3>' +
            '<p>{{Email}}</p></a></li>';
            var html = _.reduce(_.filter(data, this.filter),
            function(result, employee) {
                return result + Mustache.to_html(template, employee);
            },
            "");
            $('#employees').html(html).listview('refresh');
        },
        add: function(employee) {
            App.employees.push(employee);
            var template = '<li><a href="" onClick="App.showEmployee({{Id}}); return false;">' +
            '<img src="{{ImageUrl}}"/>' +
            '<h3>{{FirstName}} {{LastName}}</h3>' +
            '<p>{{Email}}</p></a></li>';
            var html = Mustache.to_html(template, employee);
            $('#employees').append(html).listview('refresh');
        },
        init: function() {
            this.filter = this.allFilter;
            var useLocal = true;
            var username = localStorage.getItem('username');
            var password = localStorage.getItem('password');
            var employeesData = localStorage.getItem('employeesData');
            if (employeesData != null && useLocal) {
                App.employees = JSON.parse(employeesData);
                App.render(App.employees);
            } else {
                if (username != null && password != null) {
                    $.ajax({
                        url: 'https://bekk-employees.herokuapp.com/employees',
                        data: {
                            username: username,
                            password: password
                        },
                        dataType: "jsonp",
                        error: function() {
                            $.mobile.changePage($("#loginPage"));
                        },
                        success: function(data) {
                            _.each(data,
                            function(e) {
                                $.ajax({
                                    url: 'https://bekk-employees.herokuapp.com/image',
                                    data: {
                                        employee: e.Id,
                                        username: username,
                                        password: password
                                    },
                                    dataType: "jsonp",
                                    success: function(data) {
                                        e.ImageUrl = data.img64;
                                        App.add(e);
                                    }
                                });
                            });
                            localStorage.setItem('employeesData', JSON.stringify(data));
                        }
                    });
                } else {
                    $.mobile.changePage($("#loginPage"));
                }
            }
        }
    }
    $('.my-nav').click(function() {
        $('.ui-btn-active').removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');
        var $target = $(this).children();
        while ($target.length) {
            $target = $target.children();
        }
        var department = $target.end().text();
        if (department == "Alle") {
            App.filter = App.allFilter;
        } else {
            App.department = department;
            App.filter = App.belongsToDepartmentFilter;
        }
        App.render(App.employees);
        return false;
    });
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        localStorage.setItem("username", $("#username").val());
        localStorage.setItem("password", $("#password").val());
        $.mobile.changePage($("#employeeListPage"));
        App.init();
        return false;
    });
    App.init();
});