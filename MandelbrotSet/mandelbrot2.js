//
// Display a Mandelbrot set
//

var canvas;
var gl;


/* default data*/

/* N x M array to be generated */

var scale = 0.5;
var cx = -.5;             /* center of window in complex plane */
var cy = 0.0;
var max = 100;             /* number of interations per point */

var n = 1024;
var m = 1024;

var program;

var prevCx = [];
var prevCy = [];
var prevScale = [];

//----------------------------------------------------------------------------

onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Create and initialize a buffer object
    // I've changed the point - so now we use all canvas area.
    var points = [  
    vec4(-1.0, -1.0, 0.0, 1.0),
	vec4(-1.0, 1.0, 0.0, 1.0),
	vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
	vec4(1.0, -1.0, 0.0, 1.0),
    vec4(-1.0, -1.0, 0.0, 1.0) ];

    // Load shaders and use the resulting shader program
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up vertex arrays
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    
    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0,0);
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );
    
    gl.uniform1f( gl.getUniformLocation(program, "scale"), scale);
    gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
    gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);

/*
    document.getElementById("Center X").onchange = function() {
        cx = event.srcElement.value;
        gl.uniform1f( gl.getUniformLocation(program, "cx"), cx);
    };
    document.getElementById("Center Y").onchange = function() {
        cy = event.srcElement.value;
        gl.uniform1f( gl.getUniformLocation(program, "cy"), cy);
    };
    document.getElementById("Size").onchange = function() {
       scale = 1.0/event.srcElement.value;
       gl.uniform1f( gl.getUniformLocation(program, "scale"), scale);
    };*/

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();

    canvas.addEventListener("mousedown", function(){
        if(!window.event.shiftKey){
            gl.uniform1f( gl.getUniformLocation(program, "cx"), 2 * event.clientX / canvas.width - 1 + cx);
            gl.uniform1f( gl.getUniformLocation(program, "cy"), 1 - 2 * event.clientY / canvas.height);
            gl.uniform1f( gl.getUniformLocation(program, "scale"), 1.0);
        }else{
            //console.log( 2 * event.clientX / canvas.width - 1, 1 - 2 * event.clientY / canvas.height);
            gl.uniform1f( gl.getUniformLocation(program, "cx"), -0.5);
            gl.uniform1f( gl.getUniformLocation(program, "cy"), 0.0);
            gl.uniform1f( gl.getUniformLocation(program, "scale"),0.5);}

    });
}

//----------------------------------------------------------------------------

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    requestAnimFrame(render);
}



