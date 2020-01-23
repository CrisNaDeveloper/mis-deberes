$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;
});
var config = {
	apiKey: "AIzaSyDiU2xMrsqPfiT0n4vnIa9OAIOZMjAIVxo",
	authDomain: "mis-deberes.firebaseapp.com",
	databaseURL: "https://mis-deberes.firebaseio.com",
	projectId: "mis-deberes",
	storageBucket: "mis-deberes.appspot.com",
	messagingSenderId: "616346485951",
	appId: "1:616346485951:web:b512fb38900d74fe"
};


firebase.initializeApp(config);


var db = firebase.firestore();

var fechayhora;
var timestamp;
var offset;


var offsetRef = firebase.database().ref(".info/serverTimeOffset");
offsetRef.on("value", damefechayhora, errorfecha);

function damefechayhora(snap) {
	offset = snap.val();
	timestamp = new Date().getTime() + offset;



	var d = new Date(timestamp);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();

	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();
	var curr_sec = d.getSeconds();


	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}

	fechayhora = day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

}




function formateofecha(fecha) {





	var day = fecha.getDate();
	var month = fecha.getMonth() + 1;
	var year = fecha.getFullYear();

	var curr_hour = fecha.getHours();
	var curr_min = fecha.getMinutes();
	var curr_sec = fecha.getSeconds();


	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}

	return day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

}

function errorfecha(e) {

	console.log("error" + e);
}




var email = "";
var id_test = "";
var nombre = ""
var preg = "";
var res = "";
var numpreguntas = 1;

var numpregcuestion = 1;
var numpregtotaltest = 0;
var aciertos = 0;
var respanterior = "";
var acertada = 0;
var numrespaprobar = 0;
var emailadministrador = "c_navarro_martinez@hotmail.com"
var valorpremio = "";



function aceptar_registro() {

	email = $('#usuarionuevo').val();
	var autor = firebase.auth();

	var password = $('#passwordnuevo').val();
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function (autor) {
			console.log("usuario creado" + email);

			//pasar a la siguiente pagina
			$.mobile.changePage("#inicio", {
				transition: "slide",
				reverse: true
			})
			//leer_test(email);


			alertify.success("Usuario Creado");
		}).catch(function (error) {

			var errorCode = error.code;
			var errorMessage = error.message;

			alertify.error(errorMessage);
			console.log(errorMessage);


		});
}




function validar_usuario() {

	email = $('#usuario').val();
	var password = $('#password').val();

	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function () {
		
			$.mobile.changePage("#inicio", {
				transition: "slide",
				reverse: true
			});
				leer_test(email);

		})
		.catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			alertify.error(errorMessage);
		});


}



function recuperacontrasenna(emailAddress) {

	if (emailAddress != "") {
		firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
			alertify.success("Se ha enviado un mensaje a su correo");
		}).catch(function (error) {
			alertify.success("ha ocurrido un error al enviar el mensaje");
		});
	} else {
		alertify.error("Rellene el campo usuario" );
	}
}


function desconectar() {

	firebase.auth().signOut().then(function () {
		alertify.success("desconectado");
		$('#usuario').val("");
		$('#password').val("");
		$.mobile.changePage("#login", {
			transition: "slide",
			reverse: true
		});
	}).catch(function (error) {
		alertify.error("ha habido un error" + error);
	});
}


function crear_test() {




	$('#cabpreguntas').empty();
	$('#divNivel').empty();

	numpreguntas = 1;


	$("#sigpreg").removeClass("ui-disabled");
	//cargaredades();
	//cargarcategorias();
	var nom = $('#nomtest').val();

	numrespaprobar = $('#aciertos').val();

	valorpremio = $('#premio').val();

	var usu = email;

	var textoedad = $("#listaedades option:selected").text();
	var valoredad = $("#listaedades").val();
	var textocategoria = $("#listacategorias option:selected").text();
	var valorcategoria = $("#listacategorias").val();

	if (valoredad == "--") {
		alertify.error("Ha de seleccionar edad");

	} else {
		if (valorcategoria == "--") {
			alertify.error("Ha de seleccionar la categoria");
		}



		if ((isNaN(numrespaprobar)) || numrespaprobar == "" || numrespaprobar == 0) {
			alertify.error("Ha de poner un número de respuestas para aprobar");

		} else {

			if (nom != "") {

				db.collection("tests").add({
					nombre: nom,
					numrespaprobar: numrespaprobar,

					premio: valorpremio,

					usuario_creador: usu,
					timestamp: timestamp,
					id_categoria: valorcategoria,
					id_edad: valoredad

				})
					.then(function (docRef) {




						$.mobile.changePage("#preguntas", {
							transition: "slide",
							reverse: true
						});
						for (var i = 1; i < 5; i++) {


							var valboton = "guardar" + i;
							var valradio = "radio" + i;
							var valimput = "opcion" + i;


							$("#" + valimput).show();
							$("#" + valboton).removeClass("ui-disabled");
							$('label[for="' + valradio + '"]').hide();
							$('label[for="' + valimput + '"]').show();

							document.getElementById(valradio).style.visibility = 'hidden';
							$("#" + valboton).text("Guardar Respuesta" + i);
							$("#" + valimput).val("");

						}
						alertify.success("Test creado");
						console.log("Teste creado ", docRef.id);
						id_test = docRef.id;
						$('#divNivel').empty();

						$('#divNivel').append("PREGUNTA: " + numpreguntas + " ACIERTOS PARA APROBAR: " + numrespaprobar);

						$('#cabpreguntas').append(" PREGUNTAS DEL TEST: " + nom);


					})
					.catch(function (error) {

						console.error("Error adding document: ", error);
					});
			} else {
				alertify.error("Ha de poner un nombre");
			}
		}
	}
	leer_test(email);
}


function crear_pregunta() {

	preg = $('#pregunta').val();


	res = parseInt($('input:radio[name=respuesta]:checked').val());


	var respuestas = [];

	for (var i = 1; i < 5; i++) {


		var opciones = "opcion" + i;


		if ($("#" + opciones).val() != "") {
			respuestas.unshift($("#" + opciones).val());

		}

	}



	//if con else de david
	if (respuestas.length == 0 && (res == "" || res == null || res == undefined)) {
		alertify.error("Ha de insertar una respuesta y ademas ha de guardarla");
		return false;



	} else {
		
		if(isNaN(res)){
			alertify.error("Ha de seleccionar la opción correcta");
		return false;
		}

		if (preg != "" && res != "" && res != null && res != undefined) {
			db.collection("preguntas").add({

				pregunta: preg,
				respuesta: res,
				num_pregunta: numpreguntas,
				id_test: id_test,
				timestamp: timestamp

			})
				.then(function (docRef) {

					$("input[name=respuesta]").each(function (index) {
						var idpregunta = parseInt($(this).val());
						//var idtextopreg=$(this).text();

						var idtextopreg = $("label[for='radio" + idpregunta + "']").text();


						if (idtextopreg != "") {
							db.collection("opciones").add({
								id_test: id_test,
								id_pregunta: numpreguntas,
								opcion_numero: idpregunta,
								texto: idtextopreg
							})
								.catch(function (error) {
									console.error("Error adding document: ", error);
								});
						}
					});


					alertify.success("pregunta creada");
					console.log("pregunta creada ", docRef.id);

					numpreguntas = numpreguntas + 1;


					for (var i = 1; i < 5; i++) {

						var valboton = "guardar" + i;
						var valradio = "radio" + i;
						var valimput = "opcion" + i;

						$("#" + valimput).show();


						$("#" + valboton).removeClass("ui-disabled");

						$('label[for="' + valradio + '"]').hide();
						$('label[for="' + valimput + '"]').show();

						document.getElementById(valradio).style.visibility = 'hidden';

						$("#" + valboton).text("Guardar Respuesta" + i);
						$("#" + valimput).val("");
						$("label[for='radio" + i + "']").text("");

						//añadido david
						if ($("#" + valradio).is(':checked')) {
							$("#" + valradio).attr("checked", false);
							$("#" + valradio).attr("checked", "checked");
							$("#" + valradio).prop('checked', false);
							$("#" + valradio).checkboxradio("refresh");

							$("#respuesta").checkboxradio("refresh");
							//$(valradio).removeAttr("checked") ;
						}
						//fin añadido david

					}

					$('#pregunta').val('');

					//$('#respuesta').val('');
					$('#divNivel').empty();

					// $('#divNivel').append("PREGUNTA: " + numpreguntas + " ACIERTOS PARA APROBAR: " + numrespaprobar);
					$('#divNivel').append("PREGUNTA: " + numpreguntas);
					$('#formuresp').empty();

				})
				.catch(function (error) {

					console.error("Error adding pregunta: ", error);
				});

		} else {
			alertify.error("Ha de insertar una pregunta con su respuesta");
			return false;

		}//fin else david
	}

}


function terminar_test() {

	preg = $('#pregunta').val();

	res = parseInt($('input:radio[name=respuesta]:checked').val());


	if (preg != "" && res != "" && res != null && res != undefined) {
		db.collection("preguntas").add({

			pregunta: preg,
			respuesta: res,
			num_pregunta: numpreguntas,
			id_test: id_test,
			timestamp: timestamp

		})
			.then(function (docRef) {

				$("input[name=respuesta]").each(function (index) {
					var idpregunta = parseInt($(this).val());
					//var idtextopreg=$(this).text();

					var idtextopreg = $("label[for='radio" + idpregunta + "']").text();


					if (idtextopreg != "") {
						db.collection("opciones").add({
							id_test: id_test,
							id_pregunta: numpreguntas,
							opcion_numero: idpregunta,
							texto: idtextopreg
						})
							.catch(function (error) {
								console.error("Error adding document: ", error);
							});
					}
				});


				alertify.success("pregunta creada");
				console.log("pregunta creada ", docRef.id);

				numpreguntas = numpreguntas + 1;


				for (var i = 1; i < 5; i++) {

					var valboton = "guardar" + i;
					var valradio = "radio" + i;
					var valimput = "opcion" + i;

					$("#" + valimput).show();


					$("#" + valboton).removeClass("ui-disabled");
					$('label[for="' + valradio + '"]').hide();
					$('label[for="' + valimput + '"]').show();

					document.getElementById(valradio).style.visibility = 'hidden';
					$("#" + valboton).text("Guardar Respuesta" + i);
					$("#" + valimput).val("");
					$("label[for='radio" + i + "']").text("");

				}

				$('#pregunta').val('');

				//$('#respuesta').val('');
				$('#divNivel').empty();

				// $('#divNivel').append("PREGUNTA: " + numpreguntas + " ACIERTOS PARA APROBAR: " + numrespaprobar);

				$('#divNivel').append("PREGUNTA: " + numpreguntas);
				$('#formuresp').empty();

			})
			.catch(function (error) {

				console.error("Error adding pregunta: ", error);
			});

	}
	$.mobile.changePage("#inicio", {
		transition: "slide",
		reverse: true
	});
leer_test(email);

}





		
		
function leer_test(email) {

	// db.collection("tests").get().then((querySnapshot) => {

	let test = "";
	let testcompartidos = "";

	$("#listatests").empty();
	$("#listatests").listview('refresh');

	$("#listacompartidos").empty();
	$("#listacompartidos").listview('refresh');


	db.collection("tests").where("usuario_creador", "==", email).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				test = doc.data();

				cargarListaTest(doc.id, test.nombre, test.numrespaprobar, test.premio);


			});
		});



	db.collection("test_compartidos").where("usuario_comparte", "==", email).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				testcompartidos = doc.data();

				cargarListaCompartidos(testcompartidos.id_test, testcompartidos.nombre, testcompartidos.usuario_creador);


			});
		});
	db.collection("test_compartidos").where("usuario_creador", "==", emailadministrador).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				testcompartidos = doc.data();

				cargarListaCompartidos(testcompartidos.id_test, testcompartidos.nombre, "Compartido por Mis deberes");


			});
		});

}



function cargarcategorias() {
	// db.collection("tests").get().then((querySnapshot) => {

	let categoria = "";

	$("#listacategorias").empty();
	$("#listacategorias").select('refresh');


	$("#listacategorias").append("<option value='--' selected >Seleccione una categoría...</option>");
	db.collection("categorias").get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				categoria = doc.data();

				$("#listacategorias").append(" <option select value='" + categoria.id_categoria + "'>" + categoria.nombre + "</option>")



			});
		});
}

function cargaredades() {
	// db.collection("tests").get().then((querySnapshot) => {

	let edad = "";

	$("#listaedades").empty();
	$("#listaedades").select('refresh');


	$("#listaedades").append("<option select value='--'  selected>Seleccione una edad...</option>");

	db.collection("edades").get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				edad = doc.data();

				$("#listaedades").append(" <option value='" + edad.id_edad + "'>" + edad.nombre + "</option>")



			});
		});
}





function hacerTest(numpregcuestion, id_test, nombre, numrespaprobar) {


	$("#sigpreg").removeClass("ui-disabled");



	preg = "";
	acertada = 0;

	if ($('#respcuestion').val() == respanterior && $('#respcuestion').val() != "") {
		aciertos = aciertos + 1;

	}

	var preref = db.collection("preguntas");
	var consul = preref.where("id_test", "==", id_test)
	consul.where("num_pregunta", "==", numpregcuestion).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {

				preg = doc.data();
				respanterior = preg.respuesta;


				$('#pregcuestion').val('');
				$('#respcuestion').val('');
				$("#piepregunta").val('');
				$("#cabcuestionario").val('');
				$("#cabcuestionario").empty();

				$('#formuresp').empty();

				$('#piepregunta').empty();
				$('#respcuestion').empty();
				$('#pregcuestion').empty();

				$("#cabcuestionario").append(nombre);
				$("#pregcuestion").append("<label for='" + preg.pregunta + "'>");
				$("#pregcuestion").append("" + preg.pregunta + " </label>");
				$("#piepregunta").append("Pregunta :" + numpregcuestion);
				$("#piepregunta").append(" Aciertos: " + aciertos);
				$("#piepregunta").append(" Necesario para aprobar: " + numrespaprobar);
				$.mobile.changePage("#realizartest", {
					transition: "slide",
					reverse: true
				});



				db.collection("opciones")
					.where("id_test", "==", id_test)
					.where("id_pregunta", "==", numpregcuestion)

					.get()
					.then((querySnapshot2) => {
						querySnapshot2.forEach((doc2) => {

							var contestacion = doc2.data();
							if (contestacion.texto != "") {
								$('#formuresp').append("<a data-role='button' data-theme='b' data-transition='flip'  id='guardar1' onclick='crear_respuesta(" + contestacion.opcion_numero + ")' >" + contestacion.texto + "</a>");
								$('#formuresp').trigger('create');
							}
						});
					});


			});

		});


}




function crear_respuesta(res) {
	var corr = "";
	res = parseInt(res);


	var preref = db.collection("preguntas");
	var consul = preref.where("id_test", "==", id_test);
	consul.where("num_pregunta", "==", numpregcuestion).get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				respcorrecta = doc.data();
				corr = respcorrecta.respuesta;

				if (corr == res) {
					acertada = 1;
					aciertos = aciertos + 1;

				}
			})
		});


	//res = $('#respcuestion').val();


	if (numpregtotaltest != numpregcuestion) {
		if (res != "") {
			db.collection("tests_alumnos").add({

				id_test: id_test,
				id_alumno: email,
				tipo_respuesta: "textarea",
				num_respuesta: numpregcuestion,
				respuesta: res,
				timestamp: timestamp,
				acertada: acertada

			})
				.then(function (docRef) {

					numpregcuestion = numpregcuestion + 1;
					hacerTest(numpregcuestion, id_test, nombre, numrespaprobar);

				});
		} else {
			alertify.error("Inserta una respuesta");
		}

	} else {
		alertify.error("Ha de terminar el test, es la última pregunta");

		$("#sigpreg").addClass("ui-disabled")
	}

}



function terminar_respuesta() {

	var corr = "";
	res = parseInt(res);


	var preref = db.collection("preguntas");
	var consul = preref.where("id_test", "==", id_test);
	consul.where("num_pregunta", "==", numpregcuestion).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {

				respcorrecta = doc.data();
				corr = respcorrecta.respuesta;
				if (corr == res) {
					acertada = 1;
					aciertos = aciertos + 1;

				}


			})
		});


	$("#cabcuestionario").empty();
	$('#piepregunta').empty();
	$('#respcuestion').empty();
	$('#pregcuestion').empty();

	$("#cabcuestionario").append(nombre);
	$("#pregcuestion").append("<label for='" + preg.pregunta + "'>");
	$("#pregcuestion").append("" + preg.pregunta + " </label>");
	$("#piepregunta").append("Pregunta :" + numpregcuestion);
	$("#piepregunta").append(" Aciertos: " + aciertos);

	if (numpregtotaltest <= numpregcuestion) {
		if (res != "") {
			db.collection("tests_alumnos").add({

				id_test: id_test,
				id_alumno: email,
				tipo_respuesta: "textarea",
				num_respuesta: numpregcuestion,
				respuesta: res,
				timestamp: timestamp,
				acertada: acertada

			})
				.then(function (docRef) {



				});



		}

	}



	var aprobado = 0;

	if (aciertos >= numrespaprobar) {
		$('#cabepopup').empty();

			//consulto el premio
			var testpre;

			db.collection("tests").doc(id_test).get()
			.then(function(doc3){
	
					testpre = doc3.data();
					valorpremio=testpre.premio;
					
					
					$('#cabepopup').text(" Enhorabuena : Has aprobado tu código secreto es: "+ valorpremio);
	
				});
			


	

		aprobado = 1;
	} else {

		$('#cabepopup').empty();

		$('#cabepopup').text("Has suspendido");
		aprobado = 0;

	}


	db.collection("resultado_alumno").add({

		id_test: id_test,
		id_alumno: email,
		nombretest: nombre,
		aprobado: aprobado,
		aciertos: aciertos,
		aciertos_nece: numrespaprobar,
		total_preg: numpregtotaltest,
		timestamp: timestamp
	})
		.then(function (docRef) {

		});
	numpregcuestion = 1;
	numpregtotaltest = 0;
	$('#textopopup').text("Tu resultado ha sido:" + aciertos + " aciertos de los " + numrespaprobar + " para aprobar");


	

	$('#popupresultado').popup();

	
	setTimeout(function () { $('#popupresultado').popup('open') }, 1000);

	$.mobile.changePage("#inicio", {
		transition: "slide",
		reverse: true
	});
	leer_test(email);
	alertify.success("Ha decidido finalizar el test, se guardaran los resultados");
}






function cargarListaCompartidos(id_test, nombre, creador) {


	$("#listacompartidos").listview();
	$("#listacompartidos").empty();
	$("#listacompartidos").append("<li><a  onclick='cargarListaPregunta(`" + id_test + "`,`" + nombre + "`,false,`" + numrespaprobar  + "`)' >" + nombre + " creador por: " + creador + "</a>");
	$("#listacompartidos").append("</li>");
	$("#listacompartidos").listview('refresh');
}





function cargarListaTest(id_test, nombre, numrespaprobar) {


	$("#listatests").listview();
	$("#listapreguntas").empty();
	$("#listatests").append("<li><a  onclick='cargarListaPregunta(`" + id_test + "`,`" + nombre + "`,true,`" + numrespaprobar  +  "`)' >" + nombre + "</a>");


	$("#listatests").append("</li>");
	$("#listatests").listview('refresh');
}

function cargarListaPregunta(idtest, nombretest, respuesta, numresa,valorpremio) {


	respanterior = "";
	acertada = 0;
	aciertos = 0;
	id_test = idtest;
	numrespaprobar = numresa;
	nombre = nombretest;
	$('#respcuestion').val('');

	//$("#botonborrar").removeClass("ui-disabled");
	aciertos = 0;
	$.mobile.changePage("#ver_preguntas", {
		transition: "slide",
		reverse: true
	});

	let pregunta = "";
	$("#listapreguntas").empty();
	numpregtotaltest = 0;
	db.collection("preguntas").where("id_test", "==", idtest).get()
		.then((querySnapshot) => {
			// $("#listapreguntas").append(" <h2 data-theme='b' data-form='ui-bar-b'>" + nombretest + " Respuestas para aprobar: " + numrespaprobar + "</h3>");


			$("#listapreguntas").append(" <h2 data-theme='b' data-form='ui-bar-b'>" + nombretest + "</h2>");
			querySnapshot.forEach((doc) => {
				// console.log(`${doc.nombre} => ${doc.data()}`);

				let pregunta = doc.data();
				numpregtotaltest = numpregtotaltest + 1;



				var pregant = "";

				db.collection("opciones")
					.where("id_test", "==", idtest)
					.where("id_pregunta", "==", pregunta.num_pregunta).get()
					.then((querySnapshot2) => {

						querySnapshot2.forEach((doc2) => {
							let contestacion = doc2.data();




							if (contestacion.texto != "") {
								if (pregant != pregunta.pregunta) {
									$("#listapreguntas").append("<div class='ui-body-b' data-theme='b'>" + pregunta.pregunta);
								}
								$("#listapreguntas").append("<div data-theme='a' class='ui-btn-active'>" + contestacion.texto + "</div>");
							}
							pregant = pregunta.pregunta;

						});


					});


			});

			$("#listapreguntas").append("<h3> Preguntas Totales: " + numpregtotaltest + "</h3>");




		});


	$("#pieverpreg").empty();
	$("#pieverpreg").append("<a href='#inicio' data-role='button' data-transition='flip'>volver</a>");
	$("#pieverpreg").append("<a data-role='button' data-transition='flip' onclick='hacerTest(numpregcuestion,id_test,nombre)' >Hacer encuesta</a>");

	if (emailadministrador == email) {


		$("#pieverpreg").append("<a href='#inicio' data-role='button' data-transition='flip' id='botonborrar' onclick='borrarTest(id_test)'>Borrar esta encuesta</a>");

	}

	$("#pieverpreg").trigger("create");
	$("#pieverpreg").trigger("refresh");

}


function borrarTest(id_test) {
	var usuariocrea = "";


	var test_borrar = db.collection('tests').doc(id_test);
	test_borrar.get()
		.then(function (doc) {
			let registro1 = doc.data();
			usuariocrea = registro1.usuario_creador;
			doc.ref.delete();
		
		}).catch(function (error) {
			console.error("Error borrando en test: ", error);
		});

	var compartidos_borrar = db.collection('test_compartidos').where('id_test', '==', id_test);
	compartidos_borrar.get()
		.then(function (querySnapshot) {
			querySnapshot.forEach(function (doc2) {

				let registro2 = doc2.data();
				doc2.ref.delete();
			});
		}).catch(function (error) {
			console.error("Error borrando compartidos: ", error);
		});



//si es mio el test
	if (usuariocrea == email) {

		var preguntas_borrar = db.collection('preguntas').where('id_test', '==', id_test);
		preguntas_borrar.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.delete();
				});
			}).catch(function (error) {
				console.error("Error borrando preguntas: ", error);
			});

		db.collection("tests").doc(id_test).delete()
			.then(function () {
				console.log("Document successfully deleted!");

			})
			.catch(function (error) {
				console.error("Error borrando test: ", error);
			});

//fin si es mio el test

		var hechosalumnos_borrar = db.collection('tests_alumnos').where('id_test', '==', id_test);
		hechosalumnos_borrar.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.delete();
				});
			}).catch(function (error) {
				console.error("Error borrando tests alumnos: ", error);
			});


		var resultados_alumno = db.collection('resultado_alumno').where('id_test', '==', id_test);
		resultados_alumno.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					doc.ref.delete();
				});
			}).catch(function (error) {
				console.error("Error borrando los resultados del alumno: ", error);
			});
	}
	leer_test(email);
}


function limpiarCrearTest() {
	$('#nomtest').val('');
	$('#aciertos').val('');
	numpreguntas = 1;
	numrespaprobar = 0;
	cargarcategorias();
	cargaredades();
}

function compartirTest() {

	$("#divamigos input[name='grupocheckamigos']").each(function () {
		if (this.checked) {

			let usucom = "";
			usucom = this.id;

			db.collection("test_compartidos").add({
				id_test: id_test,
				nombre: nombre,
				usuario_comparte: usucom,
				usuario_creador: email,
				timestamp: timestamp
			})
				.then(function (docRef) {
					alertify.success("Test compartido")
					console.log("Test compartido ", docRef.id);
					$.mobile.changePage("#inicio", {
						transition: "slide",
						reverse: true
					});

					$('#divNivel').empty();

				})
				.catch(function (error) {

					console.error("Error compartiendo documento: ", error);
				});



		}
	});


}



function annadirAlumno() {

	var alumnew = $('#alumnonuevo').val();
	var apodonew = $('#apodonuevo').val();
	if (apodonew != "" || alumnew != "") {
		db.collection("usuarios_alumnos").add({
			usuario_creador: email,
			usuario_comparte: alumnew,
			apodo: apodonew,
			timestamp: timestamp

		})
			.then(function (docRef) {
				alertify.success("Alumno añadido")
				console.log("alumno añadido ", docRef.id);

				$.mobile.changePage("#inicio", {
					transition: "slide",
					reverse: true
				});

			})
			.catch(function (error) {

				console.error("Error compartiendo documento: ", error);
			});

	} else {
		alertify.error("ha de poner un apodo y un correo");

	}
}


function cargarListaAmigos() {

	let amigo = "";
	$("#grupofieldamigos").empty();
	$("#divamigos").empty();
	$("#grupofieldamigos").empty();


	if (email == emailadministrador) {
		$("#divamigos").append("<p>Eres el administrador por eso ves todos los usuarios</p>");
		db.collection("usuarios_alumnos").get()

			.then((querySnapshot) => {

				$("#divamigos").append("<fieldset data-role='controlgroup' id='grupofieldamigos' data-theme='b'><legend>Otros Alumnos:</legend>");

				querySnapshot.forEach((doc) => {

					amigo = doc.data();

					$("#grupofieldamigos").append("<div class='ui-checkbox'><label   name='" + amigo.usuario_comparte + "'   for='" + amigo.usuario_comparte + "'>" + amigo.apodo + "</label><input data-theme='b'  name='grupocheckamigos' id='" + amigo.usuario_comparte + "' type='checkbox' ></div>");


				});

				$("#divamigos").append("</fieldset>");
				$("#grupofieldamigos").trigger('create');
			});
	} else {
		db.collection("usuarios_alumnos").where("usuario_creador", "==", email).get()

			.then((querySnapshot) => {

				$("#divamigos").append("<fieldset data-role='controlgroup' id='grupofieldamigos' data-theme='b'><legend>Otros Alumnos:</legend>");

				querySnapshot.forEach((doc) => {

					amigo = doc.data();

					$("#grupofieldamigos").append("<div class='ui-checkbox'><label   name='" + amigo.usuario_comparte + "'   for='" + amigo.usuario_comparte + "'>" + amigo.apodo + "</label><input data-theme='b'  name='grupocheckamigos' id='" + amigo.usuario_comparte + "' type='checkbox' ></div>");


				});

				$("#divamigos").append("</fieldset>");
				$("#grupofieldamigos").trigger('create');
			});
	}


	if (amigo == "") {

		$("#divamigos").append("<p>Ha de añadir alumnos para poder compartir</p>");

	}

}


$('#closeresult').on('click', function () {
	$("#dialog").hide();

});

function cargarListaAlumnos() {

	$.mobile.changePage("#resultados", {
				transition: "slide",
				reverse: true
			})
			
	let alumno = "";

	$("#listaalumnos").empty();
	$("#listaalumnos").select('refresh');




	$("#listaalumnos").append("<option value='" + email + "' >Mis estadísticas</option>");
	db.collection("usuarios_alumnos").where("usuario_creador", "==", email)
		.get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {


				alumno = doc.data();

				$("#listaalumnos").append(" <option  value='" + alumno.usuario_comparte + "' >" + alumno.apodo + "</option>")



			});
		});
		
		
		$("#listaalumnos").select('refresh');
	
}





function cargarTestAlumno() {

	$("#tbodyresultado").empty();


	let test = "";
	var contpri = 1;
	var textoalumno = $("#listaalumnos option:selected").text();
	var valoralumno = $("#listaalumnos").val();

	db.collection("resultado_alumno").where("id_alumno", "==", valoralumno).get()
		.then((querySnapshot) => {

			querySnapshot.forEach((doc) => {

				var testaprobado = "NO";
				test = doc.data();
				var fechareatest = new Date(test.timestamp);
				doc.timestamp
				if (test.aprobado == 1) {
					testaprobado = "SI";
				}
				$("#tbodyresultado").append("<tr id='trdentro'><td >" + test.nombretest + "<td>" + testaprobado + "</td><td>" + formateofecha(fechareatest) + "</td><td> " + test.aciertos + "</td><td>" + test.total_preg + "</td><td>" + test.aciertos_nece + "</td></tr>");
				contpri = contpri + 1;
				$("#tbodyresultado").trigger("create");
				$("#tablaresultados").table("refresh");

			});

			$("#tbodyresultado").trigger("create");


		});

}



function guardoRespuesta(opcion) {


	var idimput = 'opcion' + opcion;
	var idboton = 'guardar' + opcion;
	var idradio = 'radio' + opcion;
	//añadido david verifar texto
	var vtexto = $("#" + idimput).val();
	if (vtexto.length == 0) {


		alertify.error("Para guardar la respuesta ha de escribir");
		return false;
	}
	//fin añadido david
	var textoAnterior = $("#" + idboton).text() + ": ";
	$("#" + idboton).text(textoAnterior + $("#" + idimput).val());
	$('label[for="' + idimput + '"]').hide();

	$("#" + idimput).hide();
	$("#" + idboton).addClass("ui-disabled")
	//$("#"+idradio).show();

	document.getElementById(idradio).style.visibility = 'visible';
	$('label[for="' + idradio + '"]').show();
	$('label[for="' + idradio + '"]').text($("#" + idimput).val());


	//$("#" + idradio).attr("checked", "checked");
	$("#" + idradio).checkboxradio("refresh")
	$("#respuesta").checkboxradio("refresh");


}
