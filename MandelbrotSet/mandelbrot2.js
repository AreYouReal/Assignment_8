//
// Display a Mandelbrot set
//

var canvas;
var gl;


/* default data*/

/* N x M array to be generated */

var scale = 1.0;
var cx = -.5;             /* center of window in complex plane */
var cy = 0.0;
var max = 100;             /* number of interations per point */

var n = 1024;
var m = 1024;

var program;

// Previous values for "back steping" posibility
var prevCx = [];
var prevCy = [];
var prevScale = [];
var SCALE_FACTOR = 1.5;
var colorSheme = 0;

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
    gl.uniform1i( gl.getUniformLocation(program, "colorSheme"), colorSheme);

    document.getElementById("ColorSheme").onchange = function() {
       colorSheme = event.srcElement.value;
       gl.uniform1i( gl.getUniformLocation(program, "colorSheme"), colorSheme);
    };

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();

    // Mouse listener - catching the mouse click and mouse shift click.
    // When mouse shift click is detected - step back.
    canvas.addEventListener("mousedown", function(){
        var currentCx, currentCy, currentScale;
        if(!window.event.shiftKey){
            var newCx = cx;
            var newCy = 0.0;
            var previousScale = 1.0;
            if(prevCx.length > 0){
                newCx = prevCx[prevCx.length - 1];
                newCy = prevCy[prevCy.length - 1];
                previousScale = prevScale.length * SCALE_FACTOR;
            }
            currentCx = ( 2 * event.clientX / ( canvas.width ) - 1 ) / previousScale + newCx;
            currentCy = ( 1 - 2 * event.clientY / ( canvas.height ) ) / previousScale + newCy;
            currentScale = SCALE_FACTOR + previousScale;

            prevCx.push(currentCx);
            prevCy.push(currentCy);
            prevScale.push(currentScale);
            gl.uniform1f( gl.getUniformLocation(program, "cx"), currentCx);
            gl.uniform1f( gl.getUniformLocation(program, "cy"), currentCy);
            gl.uniform1f( gl.getUniformLocation(program, "scale"), currentScale);
        }else{
            if(prevCx.length > 1 && prevCy.length > 1 && prevScale.length > 1){
                currentCx = prevCx.pop();
                currentCy = prevCy.pop();
                currentScale = prevScale.pop();
                currentCx = prevCx[prevCx.length - 1];
                currentCy = prevCy[prevCy.length - 1];
                currentScale = prevScale[prevScale.length - 1];
            }else{
                currentCx = cx;
                currentCy = cy;
                currentScale = 1.0;
                prevCx.length = prevCy.length = prevScale.length = 0;
            }
            gl.uniform1f( gl.getUniformLocation(program, "cx"), currentCx);
            gl.uniform1f( gl.getUniformLocation(program, "cy"), currentCy);
            gl.uniform1f( gl.getUniformLocation(program, "scale"), currentScale);
        }
    });
}

//----------------------------------------------------------------------------

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    requestAnimFrame(render);
}



