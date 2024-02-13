// PARAMETERS AND THEIR MEANING
/*
--------------------------------------------------------------------------------------------------------------------------
DELTA_T
Delta_t is the time between two frames, in ms. It is the time the simulation takes to compute and display a frame.
Changing it doesn't change the simulation behaviour, it alters the speed, and cost of execution
--------------------------------------------------------------------------------------------------------------------------
ALPHA
Alpha is a disintegration rate, in % of disintegration per frames.
It is rounded down, and the error is stored in a variable. When the error reaches 1, it is rounded up and reset to 0.
This means that on low killing values, if i must kill 0.1 particle / frame, i will kill 1 particle every 10 frames.
--------------------------------------------------------------------------------------------------------------------------
BETA
Beta is a production rate, in units per 100 frames.
It is implemented to calculate the time between two productions, so that :
time_to_production = 100 / beta, rounded down.
The maximal value for beta is 100, which stands for a production every frame.
--------------------------------------------------------------------------------------------------------------------------
PSEUDO-K
Mimics the behaviour of k, but inexactly represents it.
It is used to calculate the time to unbind, so that :
time_to_unbind = 1 / pseudo_k, rounded down.
*/

const parameters = {
  // SIMULATION CONFIGURABLE PARAMETERS

  // Framework parameters
  delta_t: 50, // animation frame duration in ms
  input_delay: 500, // delay in ms before input is taken into account
  show_hitboxes: false, // show hitboxes for debugging
  lexa_max_amount: 1500,
  reca_max_amount: 1000,

  // Default parameters
  pause: false, // pauses the simulation
  transcription: true,
  lexa_desintegration_rate: 0.2, // in % per frame. This is alpha
  min_desintegration_rate: 0,
  max_desintegration_rate: 100,
  lexa_production_rate: 20, // in units per 100 frame. This is beta
  min_production_rate: 0,
  max_production_rate: 100,
  pseudo_k: 0.02, // opposite of the time to unbind
  min_pseudo_k: 0.001,
  max_pseudo_k: 10,
  plasmid_pseudo_k: [0.2, 0.01, 0.005],
  dna_damage: 0,
  min_dna_damage: 0,
  max_dna_damage: 3,
  reca_production_rate: 20, // in units per 100 frame. This is gamma
  min_reca_production_rate: 0,
  max_reca_production_rate: 100,
  reca_desintegration_rate: 0.2, // in % per frame. This is delta
  min_reca_desintegration_rate: 0,
  max_reca_desintegration_rate: 100,

  // LexA parameters
  time_to_rebind: 10, // in animation frames
  lexa_spawn_duration: 5, // Length of spawning animation in frames
  lexa_speed: 5,
  lexa_random_speed_weight: 1, // How random lexa movement is. 0 : pure collision model

  // RecA parameters
  default_reca_amount: 10, // Default amount of reca particles when loading model C or D
  reca_speed: 3,
  reca_spawn_duration: 20, // Length of spawning animation in frames
  reca_random_speed_weight: 1.5, // How random reca movement is. 0 : pure collision model

  // Position parameters
  reca_spawn_x: 0,
  reca_spawn_y: 0,

  lexa_dna_x: 400,
  lexa_dna_y: 300,

  plasmid_coordinates: [
    [100, 100],
    [200, 200],
    [300, 300],
  ],

  /*
  PLASMID EXPRESSION PARAMETERS
  Plasmid expression is measured other the latest 1000 frames (parametrable). The "activation coefficient" is the ratio of the amount of 
  frames during whih plasmid wasn't repressed during the last 1000 frames.
  Each plasmid has 10 range of values : if below 10% of activation, it will reduce DNA damage by xxx each frame. If between 10 and 20, 
  by something else...
  The time of measurement, as well as the values of dna repair per threshold are parametrable below.
  They are multiplied by a weight coefficient for readability.
  */
  plasmid_expression_time_lapse: 1000,
  repair_weight_coefficient: 0.000001,
  plasmid_thresholds: [
    [0, 0, 0, 0, 2, 5, 7, 10, 15, 25],
    [0, 0, 0, 0, 0, 0, 0, 40, 80, 150],
    [0, 0, 0, 0, 0, 0, 0, 0, 500, 700],
  ],

  // Aesthetic parameters
  out_of_bounds: 10, // distance from the canvas border where particles are considered out of bounds

  lexa_radius: 4,
  lexa_color: "purple",

  reca_radius: 5.25,
  reca_color: "green",

  dna_height: 7,
  dna_length: 200,
  dna_curve_radius: 4,
  dna_color: "gray",

  operon_length: 40,
  operon_offset: 30,
  operon_color: "orange",

  legend_dna_length: 30,
  legend_dna_height: 7,
  legend_dna_curve_radius: 4,

  plasmid_radius: 40,
  plasmid_operon_angle: 0.8,

  // Others
  model_default_color: "rgb(242, 242, 242)",
  model_selected_color: "rgb(200, 200, 200)",

  graph_time_sample: 1000, // The number of frames used in the graph

  description_model_A: "Simple production/degradation model",
  description_model_B: "Negative AutoRegulation model",
  description_model_C: "NAR with DNA damage model",
  description_model_D: "NAR with DNA damage and SOS response model",

  equation_1_model_A: "\\frac{d[lexA]}{dt} = \\beta - \\alpha [lexA]",
  equation_2_model_A: "[lexA]_{ss} = \\frac{\\beta}{\\alpha}",

  equation_1_model_B:
    "\\frac{d[lexA]}{dt} = \\beta * \\frac{1}{1 + \\frac{[lexA]}{k}} - \\alpha [lexA]",
  equation_2_model_B: "",

  equation_1_model_C:
    "\\frac{d[lexA]}{dt} = \\beta * \\frac{1}{1 + \\frac{[lexA]}{k}} - \\alpha [lexA] - \\phi [recA] [lexA]",
  equation_2_model_C: "",

  equation_1_model_D:
    "\\frac{d[lexA]}{dt} = \\beta * \\frac{1}{1 + \\frac{[lexA]}{k}} - \\alpha [lexA] - \\phi [recA] [lexA]",
  equation_2_model_D:
    "\\frac{d[recA]}{dt} = \\gamma * dna\\_damage - \\delta [recA]",

  // SIMULATION AUTO-COMPUTED PARAMETERS
  lexa_amount: 0,
  reca_amount: 0,
  real_reca_amount: 0, // This is a float, used for computations

  lexa_production_cooldown: 0, // in animation frames. Grows as beta diminishes
  time_to_unbind: 0, // in animation frames. Grows as k diminishes

  stacking_rounding_error: 0, // When deleting lexa, round down and store the error here. When it reaches 1, rounds up and resets to 0

  plasmid_operon_hitbox: [
    { min_x: 0, max_x: 0, min_y: 0, max_y: 0 },
    { min_x: 0, max_x: 0, min_y: 0, max_y: 0 },
    { min_x: 0, max_x: 0, min_y: 0, max_y: 0 },
  ],
  plasmid_operon_is_free: [true, true, true],
  plasmid_operon_binding: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  plasmid_bound_particle_index: [-1, -1, -1],
  plasmid_time_to_unbind: [0, 0, 0],
  lexa_dna_operon_active: false,

  lexa_particles: [],
  lexa_exists_list: [],
  reca_particles: [],
  lexa_amount_history: [],

  sos_1_activation_list: [],
  sos_2_activation_list: [],
  sos_3_activation_list: [],
  sos_activation_list_current_index: 0,

  sos_1_activation_count: 0,
  sos_2_activation_count: 0,
  sos_3_activation_count: 0,

  repair_1_history: [],
  repair_2_history: [],
  repair_3_history: [],

  lexa_operon_is_free: true,
  lexa_production_timer: 0,
  lexa_operon_min_x: 0,
  lexa_operon_max_x: 0,
  lexa_operon_min_y: 0,
  lexa_operon_max_y: 0,
  lexa_operon_binding_x: 0,
  lexa_operon_binding_y: 0,
  lexa_spawn_x: 0,
  lexa_spawn_y: 0,
  lexa_release_x: 0,
  lexa_release_y: 0,

  bound_particle_index: -1,

  selected_model: "",
  w: 0,
  h: 0,
};

function createViz() {
  console.log("Using D3 v" + d3.version);
  var svgEl = d3
    .select("#simulation-container")
    .append("svg")
    .attr("id", "simulation");

  setUpGeometry(svgEl);

  svgEl
    .append("svg")
    .attr("id", "lexa_dna_canvas")
    .attr("width", parameters.dna_length)
    .attr("height", parameters.dna_height)
    .attr("x", parameters.lexa_dna_x)
    .attr("y", parameters.lexa_dna_y);

  drawLexaDna();

  for (let i = 0; i < parameters.plasmid_coordinates.length; i++) {
    drawPlasmid(
      parameters.plasmid_coordinates[i][0],
      parameters.plasmid_coordinates[i][1],
      i
    );
  }

  svgEl.append("g").attr("id", "lexa_canvas");
  svgEl.append("g").attr("id", "reca_canvas");

  createParticles();

  launchSimulation();
}

function launchSimulation() {
  console.log("Launching simulation with parameters: ", parameters);
  instantiateHtml();
  selectModel("A");
  updatePlasmidDisplay();
  parameters.lexa_production_cooldown = 100 / parameters.lexa_production_rate;
  parameters.time_to_unbind = Math.floor(1 / parameters.pseudo_k);
  for (let i = 0; i < parameters.plasmid_pseudo_k.length; i++) {
    parameters.plasmid_time_to_unbind[i] = Math.floor(
      1 / parameters.plasmid_pseudo_k[i]
    );
  }
  for (let i = 0; i < parameters.graph_time_sample; i++) {
    parameters.lexa_amount_history.push(0);
    parameters.repair_1_history.push(0);
    parameters.repair_2_history.push(0);
    parameters.repair_3_history.push(0);
  }
  drawLexaGraph();
  drawRepairGraph();
  simulationLoop();
}

function simulationLoop() {
  // Handle background values
  lexaDying();
  lexaRebindTimer();
  lexaSpawning();
  lexaMovement();
  lexaProduction();
  freePlasmidOperons();
  lexaUpdateAmount();

  if (parameters.selected_model == "C" || parameters.selected_model == "D") {
    recaJustDied();
    recaSpawning();
    recaMovement();
  }

  if (parameters.selected_model == "D") {
    recaCalculations();
    sosActivationUpdate();
    DNA_repair();
  }

  // Update display
  updateLexaDisplay();
  updateRecaDisplay();
  updateResults();
  updateLexaHistory();
  updateLexaGraph();
  if (parameters.selected_model == "D") {
    updateRepairGraph();
  }

  // Loop
  if (!parameters.pause) {
    setTimeout(simulationLoop, parameters.delta_t);
  }
}

function setUpGeometry(svgEl) {
  var container = document.getElementById("simulation-container");

  parameters.w = container.clientWidth;
  parameters.h = container.clientHeight;

  parameters.reca_spawn_x = parameters.w / 2;

  svgEl.attr("width", parameters.w);
  svgEl.attr("height", parameters.h);

  parameters.lexa_dna_x = parameters.w / 2 - parameters.dna_length / 2;
  parameters.lexa_dna_y = parameters.h / 2 - parameters.dna_height / 2;

  parameters.plasmid_coordinates[0][0] = parameters.w / 2;
  parameters.plasmid_coordinates[0][1] = parameters.h / 4;
  parameters.plasmid_coordinates[1][0] = parameters.w / 4;
  parameters.plasmid_coordinates[1][1] = (3 * parameters.h) / 4;
  parameters.plasmid_coordinates[2][0] = (3 * parameters.w) / 4;
  parameters.plasmid_coordinates[2][1] = (3 * parameters.h) / 4;
}

function createParticles() {
  // Create empty lexa particle templates
  for (let i = 0; i < parameters.lexa_max_amount; i++) {
    parameters.lexa_particles.push({
      id: i,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: parameters.lexa_radius,
      color: parameters.lexa_color,
      exists: false,
      spawning: false,
      is_bound: false,
      bound_to: "",
      just_bounded: 0, // When particle unbinds, it can't rebind for a few frames
      spawn_state: 0, // For spawning animation
      time_to_unbind: 0, // Countdown to unbind from operon
      time_to_rebind: 0, // Countdown before being able to rebind to operon
      just_died: false, // To create a delay before being reused, and avoid visual bugs
    });
  }

  // Create empty reca particle templates
  for (let i = 0; i < parameters.reca_max_amount; i++) {
    parameters.reca_particles.push({
      x: parameters.reca_spawn_x,
      y: parameters.reca_spawn_y,
      spawn_goal_x: 0,
      spawn_goal_y: 0,
      vx: 0,
      vy: 0,
      radius: parameters.reca_radius,
      color: parameters.reca_color,
      exists: false,
      spawning: false,
      spawn_state: 0, // For spawning animation
      just_died: 0, // To create a delay before being reused, and avoid visual bugs
    });
  }

  // Add lexa particles to the canvas
  d3.select("#lexa_canvas")
    .selectAll("circle")
    .data(parameters.lexa_particles)
    .enter()
    .append("circle")
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => d.color)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("opacity", (d) => (d.exists ? 1 : 0));

  // Add reca particles to the canvas
  d3.select("#reca_canvas")
    .selectAll("circle")
    .data(parameters.reca_particles)
    .enter()
    .append("circle")
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => d.color)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("opacity", (d) => (d.exists ? 1 : 0));
}

function instanciateSosActivationLists() {
  parameters.sos_1_activation_list = [];
  parameters.sos_2_activation_list = [];
  parameters.sos_3_activation_list = [];

  parameters.sos_activation_list_current_index = 0;
  parameters.sos_1_activation_count = 0;
  parameters.sos_2_activation_count = 0;
  parameters.sos_3_activation_count = 0;

  const sos_1_frequency = 1 / parameters.plasmid_pseudo_k[0] / 100;
  const sos_2_frequency = 1 / parameters.plasmid_pseudo_k[1] / 100;
  const sos_3_frequency = 1 / parameters.plasmid_pseudo_k[2] / 100;

  for (let i = 0; i < parameters.plasmid_expression_time_lapse; i++) {
    random = Math.random() - 0.5;
    if (random > sos_1_frequency) {
      parameters.sos_1_activation_list.push(true);
      parameters.sos_1_activation_count++;
    } else {
      parameters.sos_1_activation_list.push(false);
    }

    if (random > sos_2_frequency) {
      parameters.sos_2_activation_list.push(true);
      parameters.sos_2_activation_count++;
    } else {
      parameters.sos_2_activation_list.push(false);
    }

    if (random > sos_3_frequency) {
      parameters.sos_3_activation_list.push(true);
      parameters.sos_3_activation_count++;
    } else {
      parameters.sos_3_activation_list.push(false);
    }
  }
}

function drawLexaDna() {
  const lexa_dna_data = `
    M0,${parameters.dna_curve_radius}
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.dna_curve_radius
  },0
    L${parameters.dna_length - parameters.dna_curve_radius},0
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.dna_length
  },${parameters.dna_curve_radius}
    L${parameters.dna_length},${
    parameters.dna_height - parameters.dna_curve_radius
  }
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.dna_length - parameters.dna_curve_radius
  },${parameters.dna_height}
    L${parameters.dna_curve_radius},${parameters.dna_height}
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 0,${
    parameters.dna_height - parameters.dna_curve_radius
  }
    L0,${parameters.dna_curve_radius}
    Z`;

  d3.select("#lexa_dna_canvas")
    .append("path")
    .attr("d", lexa_dna_data)
    .style("fill", parameters.dna_color);

  const lexa_operon_data = `M${parameters.operon_offset},${
    parameters.dna_curve_radius
  }
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.operon_offset + parameters.dna_curve_radius
  },0
    L${
      parameters.operon_offset +
      parameters.operon_length -
      parameters.dna_curve_radius
    },0
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.operon_offset + parameters.operon_length
  },${parameters.dna_curve_radius}
    L${parameters.operon_offset + parameters.operon_length},${
    parameters.dna_height - parameters.dna_curve_radius
  }
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.operon_offset +
    parameters.operon_length -
    parameters.dna_curve_radius
  },${parameters.dna_height}
    L${parameters.operon_offset + parameters.dna_curve_radius},${
    parameters.dna_height
  }
    A${parameters.dna_curve_radius},${parameters.dna_curve_radius} 0 0,1 ${
    parameters.operon_offset
  },${parameters.dna_height - parameters.dna_curve_radius}
    L${parameters.operon_offset},${parameters.dna_curve_radius}
    Z`;

  d3.select("#lexa_dna_canvas")
    .append("path")
    .attr("id", "lexa_operon")
    .attr("d", lexa_operon_data)
    .style("fill", parameters.operon_color)
    .style("opacity", parameters.lexa_dna_operon_active ? 1 : 0);

  // Get positions for particle handling

  parameters.lexa_operon_min_x =
    parameters.lexa_dna_x + parameters.operon_offset;
  parameters.lexa_operon_max_x =
    parameters.lexa_dna_x + parameters.operon_offset + parameters.operon_length;
  parameters.lexa_operon_min_y = parameters.lexa_dna_y;
  parameters.lexa_operon_max_y = parameters.lexa_dna_y + parameters.dna_height;

  parameters.lexa_spawn_x =
    parameters.lexa_dna_x +
    parameters.operon_offset +
    parameters.operon_length +
    10;
  parameters.lexa_spawn_y = parameters.lexa_dna_y + parameters.dna_height / 2;

  parameters.lexa_release_x =
    parameters.lexa_dna_x + parameters.dna_length - 10;
  parameters.lexa_release_y = parameters.lexa_dna_y + parameters.dna_height / 2;

  parameters.lexa_operon_binding_x =
    parameters.lexa_operon_min_x + parameters.operon_length / 2;
  parameters.lexa_operon_binding_y =
    (parameters.lexa_operon_min_y + parameters.lexa_operon_max_y) / 2;

  // Show hitboxes for debugging
  if (parameters.show_hitboxes) {
    d3.select("#lexa_dna_canvas")
      .append("rect")
      .attr("x", parameters.operon_offset)
      .attr("y", 0)
      .attr("width", parameters.operon_length)
      .attr("height", parameters.dna_height)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
}

function drawPlasmid(x, y, index) {
  const svg = d3
    .select("#simulation")
    .append("svg")
    .attr("id", "plasmid_" + index + "_canvas");

  svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", parameters.plasmid_radius)
    .attr("stroke", parameters.dna_color)
    .attr("stroke-width", parameters.dna_height)
    .attr("fill", "none");

  const arcGenerator = d3
    .arc()
    .innerRadius(parameters.plasmid_radius - parameters.dna_height / 2)
    .outerRadius(parameters.plasmid_radius + parameters.dna_height / 2)
    .startAngle(-parameters.plasmid_operon_angle / 2)
    .endAngle(parameters.plasmid_operon_angle / 2);

  svg
    .append("path")
    .attr("transform", "translate(" + x + "," + y + ")")
    .attr("d", arcGenerator)
    .attr("fill", parameters.operon_color);

  // Compute operon hitbox
  const length = parameters.plasmid_radius * parameters.plasmid_operon_angle;
  parameters.plasmid_operon_hitbox[index].min_x = x - length / 2;
  parameters.plasmid_operon_hitbox[index].max_x = x + length / 2;
  parameters.plasmid_operon_hitbox[index].min_y =
    y - parameters.plasmid_radius - parameters.dna_height / 2;
  parameters.plasmid_operon_hitbox[index].max_y =
    y - parameters.plasmid_radius + parameters.dna_height / 2;

  parameters.plasmid_operon_binding[index].x = x;
  parameters.plasmid_operon_binding[index].y = y - parameters.plasmid_radius;

  if (parameters.show_hitboxes) {
    svg
      .append("rect")
      .attr("x", parameters.plasmid_operon_hitbox[index].min_x)
      .attr("y", parameters.plasmid_operon_hitbox[index].min_y)
      .attr(
        "width",
        parameters.plasmid_operon_hitbox[index].max_x -
          parameters.plasmid_operon_hitbox[index].min_x
      )
      .attr(
        "height",
        parameters.plasmid_operon_hitbox[index].max_y -
          parameters.plasmid_operon_hitbox[index].min_y
      )
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
}

function updateLexaDnaOperon() {
  d3.select("#lexa_operon")
    .transition()
    .duration(parameters.delta_t)
    .style("opacity", parameters.lexa_dna_operon_active ? 1 : 0);
}

function updateLexaDisplay() {
  d3.select("#lexa_canvas")
    .selectAll("circle")
    .data(parameters.lexa_particles)
    .transition()
    .duration(parameters.delta_t)
    .ease(d3.easeLinear)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("opacity", (d) => {
      if (d.exists) {
        return 1;
      } else if (d.spawning) {
        return d.spawn_state / parameters.lexa_spawn_duration;
      } else {
        return 0;
      }
    });
}

function updateRecaDisplay() {
  d3.select("#reca_canvas")
    .selectAll("circle")
    .data(parameters.reca_particles)
    .transition()
    .duration(parameters.delta_t)
    .ease(d3.easeLinear)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("opacity", (d) => {
      if (d.exists) {
        return 1;
      } else if (d.spawning) {
        return d.spawn_state / parameters.reca_spawn_duration;
      } else {
        return 0;
      }
    });
}

function updatePlasmidDisplay() {
  if (parameters.selected_model == "D") {
    for (let i = 0; i < parameters.plasmid_coordinates.length; i++) {
      d3.select("#plasmid_" + i + "_canvas").style("opacity", 1);
    }
  } else {
    for (let i = 0; i < parameters.plasmid_coordinates.length; i++) {
      d3.select("#plasmid_" + i + "_canvas").style("opacity", 0);
    }
  }
}

function getFreeLexa() {
  return parameters.lexa_particles.findIndex(
    (particle) => !particle.exists && !particle.spawning && !particle.just_died
  );
}

function getFreeReca() {
  return parameters.reca_particles.findIndex(
    (particle) =>
      !particle.exists && !particle.spawning && particle.just_died == 0
  );
}

function lexaMovement() {
  parameters.lexa_particles.forEach((particle) => {
    if (particle.exists && !particle.is_bound) {
      // Update particle position based on velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Handle collisions with operons
      no_collision = collideWithOperons(particle);

      // Handle collisions with walls
      if (
        particle.x < parameters.out_of_bounds ||
        particle.x > parameters.w - parameters.out_of_bounds
      ) {
        particle.vx *= -1; // Reverse velocity in x direction
      }
      if (
        particle.y < parameters.out_of_bounds ||
        particle.y > parameters.h - parameters.out_of_bounds
      ) {
        particle.vy *= -1; // Reverse velocity in y direction
      }

      // Handle collisions with other particles
      if (no_collision) {
        parameters.lexa_particles.forEach((otherParticle) => {
          if (
            particle !== otherParticle &&
            otherParticle.exists &&
            !otherParticle.is_bound
          ) {
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If collision with particle : handle it
            if (distance < 2 * parameters.lexa_radius) {
              no_collision = false;
              // Particles collide, adjust velocities
              const angle = Math.atan2(dy, dx);
              const sine = Math.sin(angle);
              const cosine = Math.cos(angle);

              // Rotate velocities
              const vx1 = particle.vx * cosine + particle.vy * sine;
              const vy1 = particle.vy * cosine - particle.vx * sine;
              const vx2 = otherParticle.vx * cosine + otherParticle.vy * sine;
              const vy2 = otherParticle.vy * cosine - otherParticle.vx * sine;

              // Normalize result
              particleSpeed = normalizeSpeed(vx1, vy1, parameters.lexa_speed);
              otherParticleSpeed = normalizeSpeed(
                vx2,
                vy2,
                parameters.lexa_speed
              );

              particle.vx = particleSpeed.vx;
              particle.vy = particleSpeed.vy;
              otherParticle.vx = otherParticleSpeed.vx;
              otherParticle.vy = otherParticleSpeed.vy;

              // Separate particles to avoid overlap
              const overlap = 2 * parameters.lexa_radius - distance;
              particle.x -= overlap * Math.cos(angle);
              particle.y -= overlap * Math.sin(angle);
              otherParticle.x += overlap * Math.cos(angle);
              otherParticle.y += overlap * Math.sin(angle);
            }
          }
        });
      }

      // If no collision : add randomness
      if (no_collision) {
        newSpeed = randomChangeSpeed(
          particle.vx,
          particle.vy,
          parameters.lexa_speed,
          parameters.lexa_random_speed_weight
        );

        particle.vx = newSpeed.vx;
        particle.vy = newSpeed.vy;
      }
    }
  });
}

function recaMovement() {
  parameters.reca_particles.forEach((particle) => {
    if (particle.exists) {
      // Update particle position based on velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Handle collisions with walls
      if (
        particle.x < parameters.out_of_bounds ||
        particle.x > parameters.w - parameters.out_of_bounds
      ) {
        particle.vx *= -1; // Reverse velocity in x direction
      }
      if (
        particle.y < parameters.out_of_bounds ||
        particle.y > parameters.h - parameters.out_of_bounds
      ) {
        particle.vy *= -1; // Reverse velocity in y direction
      }

      // Handle collisions with other particles
      no_collision = true;
      parameters.reca_particles.forEach((otherParticle) => {
        if (
          particle !== otherParticle &&
          otherParticle.exists &&
          !otherParticle.is_bound
        ) {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If collision with particle : handle it
          if (distance < 2 * parameters.reca_radius) {
            no_collision = false;
            // Particles collide, adjust velocities
            const angle = Math.atan2(dy, dx);
            const sine = Math.sin(angle);
            const cosine = Math.cos(angle);

            // Rotate velocities
            const vx1 = particle.vx * cosine + particle.vy * sine;
            const vy1 = particle.vy * cosine - particle.vx * sine;
            const vx2 = otherParticle.vx * cosine + otherParticle.vy * sine;
            const vy2 = otherParticle.vy * cosine - otherParticle.vx * sine;

            // Normalize result
            particleSpeed = normalizeSpeed(vx1, vy1, parameters.reca_speed);
            otherParticleSpeed = normalizeSpeed(
              vx2,
              vy2,
              parameters.reca_speed
            );

            particle.vx = particleSpeed.vx;
            particle.vy = particleSpeed.vy;
            otherParticle.vx = otherParticleSpeed.vx;
            otherParticle.vy = otherParticleSpeed.vy;

            // Separate particles to avoid overlap
            const overlap = 2 * parameters.reca_radius - distance;
            particle.x -= overlap * Math.cos(angle);
            particle.y -= overlap * Math.sin(angle);
            otherParticle.x += overlap * Math.cos(angle);
            otherParticle.y += overlap * Math.sin(angle);
          }
        }
      });
      // If no collision : add randomness
      if (no_collision) {
        newSpeed = randomChangeSpeed(
          particle.vx,
          particle.vy,
          parameters.reca_speed,
          parameters.reca_random_speed_weight
        );

        particle.vx = newSpeed.vx;
        particle.vy = newSpeed.vy;
      }
    }
  });
}

function collisionWithOperon(particle) {
  // Detect lexaOperon hitbox collision
  return (
    particle.x > parameters.lexa_operon_min_x &&
    particle.x < parameters.lexa_operon_max_x &&
    particle.y > parameters.lexa_operon_min_y &&
    particle.y < parameters.lexa_operon_max_y &&
    particle.time_to_rebind <= 0
  );
}

function collideWithOperons(particle) {
  // First handle collision with lexa locus operon

  if (
    parameters.lexa_operon_is_free &&
    parameters.lexa_dna_operon_active &&
    parameters.time_to_unbind > 0 &&
    collisionWithOperon(particle)
  ) {
    parameters.lexa_operon_is_free = false;
    particle.is_bound = true;
    particle.bound_to = "lexa";
    parameters.lexa_exists_list = parameters.lexa_exists_list.filter(
      (i) => i != particle.id
    );
    particle.x = parameters.lexa_operon_binding_x;
    particle.y = parameters.lexa_operon_binding_y;
    particle.vx = 0;
    particle.vy = 0;
    particle.time_to_unbind = parameters.time_to_unbind;

    parameters.bound_particle_index = particle.id;

    return false;
  }
  // Then handle collision with plasmid operons

  for (let i = 0; i < parameters.plasmid_coordinates.length; i++) {
    if (
      particle.x > parameters.plasmid_operon_hitbox[i].min_x &&
      particle.x < parameters.plasmid_operon_hitbox[i].max_x &&
      particle.y > parameters.plasmid_operon_hitbox[i].min_y &&
      particle.y < parameters.plasmid_operon_hitbox[i].max_y &&
      parameters.plasmid_operon_is_free[i] &&
      parameters.plasmid_time_to_unbind[i] > 0 &&
      particle.time_to_rebind <= 0 &&
      parameters.selected_model == "D"
    ) {
      parameters.plasmid_operon_is_free[i] = false;
      particle.is_bound = true;
      particle.bound_to = "plasmid-" + i;
      particle.x = parameters.plasmid_operon_binding[i].x;
      particle.y = parameters.plasmid_operon_binding[i].y;
      particle.vx = 0;
      particle.vy = 0;
      particle.time_to_unbind = parameters.plasmid_time_to_unbind[i];
      parameters.lexa_exists_list = parameters.lexa_exists_list.filter(
        (i) => i != particle.id
      );

      parameters.plasmid_bound_particle_index[i] = particle.id;

      return false;
    }
  }
  return true;
}

function randomSpeed(magnitude) {
  const angle = Math.random() * 2 * Math.PI;
  const vx = magnitude * Math.cos(angle);
  const vy = magnitude * Math.sin(angle);

  // Return the 2D speed vector as an object
  return { vx: vx, vy: vy };
}

function normalizeSpeed(vx, vy, magnitude) {
  // Calculate the current speed (magnitude of the velocity vector)
  let currentSpeed = Math.sqrt(vx * vx + vy * vy);

  if (currentSpeed == 0) {
    return randomSpeed(magnitude);
  }

  // Check if the current speed is not zero to avoid division by zero
  if (currentSpeed !== 0) {
    // Calculate the scaling factor to adjust the velocity
    let scale = magnitude / currentSpeed;

    // Adjust the velocity components to achieve the desired magnitude
    vx *= scale;
    vy *= scale;
  }
  return { vx: vx, vy: vy };
}

function randomChangeSpeed(vx, vy, magnitude, random_weight) {
  vx += (Math.random() - 0.5) * random_weight * magnitude;
  vy += (Math.random() - 0.5) * random_weight * magnitude;
  return normalizeSpeed(vx, vy, magnitude);
}

function lexaDying() {
  justDiedLexa();
  if (parameters.selected_model == "C" || parameters.selected_model == "D") {
    lexaRecaDying();
  }
  lexaNaturalDying();
}

function lexaNaturalDying() {
  var toKill = Math.floor(
    (parameters.lexa_amount * parameters.lexa_desintegration_rate) / 100
  );
  parameters.stacking_rounding_error +=
    (parameters.lexa_amount * parameters.lexa_desintegration_rate) / 100 -
    toKill;

  if (parameters.stacking_rounding_error >= 1) {
    toKill += 1;
    parameters.stacking_rounding_error -= 1;
  }

  for (let i = 0; i < toKill; i++) {
    const randomIndex = Math.floor(
      Math.random() * parameters.lexa_exists_list.length
    );
    killLexa(parameters.lexa_exists_list[randomIndex]);
  }
}

function recaCalculations() {
  parameters.real_reca_amount -=
    (parameters.reca_desintegration_rate * parameters.real_reca_amount) / 100;
  parameters.real_reca_amount +=
    (parameters.reca_production_rate * parameters.dna_damage) / 100;
  changeRecaAmount(Math.round(parameters.real_reca_amount));
}

function lexaRecaDying() {
  parameters.lexa_particles.forEach((particle) => {
    if (particle.exists && !particle.is_bound) {
      parameters.reca_particles.forEach((reca_particle) => {
        const dx = reca_particle.x - particle.x;
        const dy = reca_particle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < parameters.reca_radius + parameters.lexa_radius) {
          killLexa(particle.id);
        }
      });
    }
  });
}

function killLexa(id) {
  parameters.lexa_exists_list = parameters.lexa_exists_list.filter(
    (i) => i != id
  );

  parameters.lexa_particles[id].exists = false;
  parameters.lexa_particles[id].just_died = true;
}

function justDiedLexa() {
  parameters.lexa_particles.forEach((particle) => {
    if (particle.just_died) {
      particle.just_died = false;
      particle.x = parameters.lexa_spawn_x;
      particle.y = parameters.lexa_spawn_y;
    }
  });
}

function lexaRebindTimer() {
  parameters.lexa_particles.forEach((particle) => {
    if (particle.time_to_rebind > 0) {
      particle.time_to_rebind -= 1;
    }
  });
}

function lexaUpdateAmount() {
  parameters.lexa_amount = parameters.lexa_exists_list.length;
}

function recaJustDied() {
  parameters.reca_particles.forEach((particle) => {
    if (particle.just_died == 1) {
      particle.just_died = 0;
      particle.x = parameters.reca_spawn_x;
      particle.y = parameters.reca_spawn_y;
    } else if (particle.just_died == 2) {
      particle.just_died = 1;
    }
  });
}

function lexaSpawning() {
  parameters.lexa_particles.forEach((particle) => {
    if (particle.spawning) {
      if (particle.spawn_state == parameters.lexa_spawn_duration) {
        particle.spawning = false;
        particle.exists = true;
        particle.vx = randomSpeed(parameters.lexa_speed).vx;
        particle.vy = randomSpeed(parameters.lexa_speed).vy;
        parameters.lexa_exists_list.push(particle.id);
      } else {
        particle.spawn_state += 1;
        particle.x +=
          (parameters.lexa_release_x - parameters.lexa_spawn_x) /
          parameters.lexa_spawn_duration;
      }
    }
  });
}

function recaSpawning() {
  parameters.reca_particles.forEach((particle) => {
    if (particle.spawning) {
      if (particle.spawn_state == parameters.reca_spawn_duration) {
        particle.spawning = false;
        particle.exists = true;
        particle.vx = randomSpeed(parameters.reca_speed).vx;
        particle.vy = randomSpeed(parameters.reca_speed).vy;
      } else {
        particle.spawn_state += 1;
        particle.x +=
          (particle.spawn_goal_x - parameters.reca_spawn_x) /
          parameters.reca_spawn_duration;
        particle.y +=
          (particle.spawn_goal_y - parameters.reca_spawn_y) /
          parameters.reca_spawn_duration;
      }
    }
  });
}

function lexaProduction() {
  // If the operon is free, handle production
  if (
    parameters.lexa_operon_is_free &&
    parameters.transcription &&
    parameters.lexa_production_rate > 0
  ) {
    if (parameters.lexa_production_timer <= 0) {
      // Creates a new lexa particle in a "spawn state" status
      const free_lexa_index = getFreeLexa();
      if (free_lexa_index != -1) {
        parameters.lexa_particles[free_lexa_index].x = parameters.lexa_spawn_x;
        parameters.lexa_particles[free_lexa_index].y = parameters.lexa_spawn_y;
        parameters.lexa_particles[free_lexa_index].exists = false;
        parameters.lexa_particles[free_lexa_index].spawn_state = 0;
        parameters.lexa_particles[free_lexa_index].spawning = true;
      } else {
        console.error("Maximum number of lexa particles reached");
      }

      parameters.lexa_production_timer = parameters.lexa_production_cooldown;
    }
    parameters.lexa_production_timer -= 1;
  }
  // If the operon is bound, handle the bound particle
  else if (!parameters.lexa_operon_is_free) {
    particle = parameters.lexa_particles[parameters.bound_particle_index];
    if (particle.time_to_unbind <= 0) {
      particle.is_bound = false;
      particle.bound_to = "";
      parameters.lexa_exists_list.push(particle.id);
      parameters.bound_particle_index = -1;
      parameters.lexa_operon_is_free = true;
      newSpeed = randomSpeed(parameters.lexa_speed);
      particle.vx = newSpeed.vx;
      particle.vy = newSpeed.vy;
      particle.time_to_rebind = parameters.time_to_rebind;
    } else {
      particle.time_to_unbind -= 1;
    }
  }
}

function freePlasmidOperons() {
  for (let i = 0; i < parameters.plasmid_operon_is_free.length; i++) {
    if (!parameters.plasmid_operon_is_free[i]) {
      particle =
        parameters.lexa_particles[parameters.plasmid_bound_particle_index[i]];

      if (particle.time_to_unbind <= 0) {
        particle.is_bound = false;
        particle.bound_to = "";
        parameters.lexa_exists_list.push(particle.id);
        parameters.plasmid_bound_particle_index[i] = -1;
        parameters.plasmid_operon_is_free[i] = true;
        newSpeed = randomSpeed(parameters.lexa_speed);
        particle.vx = newSpeed.vx;
        particle.vy = newSpeed.vy;
        particle.time_to_rebind = parameters.time_to_rebind;
      } else {
        particle.time_to_unbind -= 1;
      }
    }
  }
}

function selectModel(model) {
  models = ["A", "B", "C", "D"];

  previousModel = parameters.selected_model;
  parameters.selected_model = model;

  if (previousModel == model) {
    return;
  }

  renderEquation(model);
  renderDescription(model);
  renderParameters(model);

  models.forEach((m) => {
    if (m == model) {
      document.getElementById("model-" + m).style.backgroundColor =
        parameters.model_selected_color;
    } else {
      document.getElementById("model-" + m).style.backgroundColor =
        parameters.model_default_color;
    }
  });

  // Activate operon
  if (previousModel == "A" && (model == "B" || model == "C" || model == "D")) {
    parameters.lexa_dna_operon_active = true;
    updateLexaDnaOperon();
  }

  // Deactivate operon
  if (
    (previousModel == "B" || previousModel == "C" || previousModel == "D") &&
    model == "A"
  ) {
    turnOutLexaOperon();
    updateLexaDnaOperon();
  }

  // Delete reca particles
  if (
    (previousModel == "C" || previousModel == "D") &&
    (model == "A" || model == "B")
  ) {
    parameters.default_reca_amount = parameters.reca_amount;
    changeRecaAmount(0);
  }

  // Add reca particles
  if (
    (previousModel == "A" || previousModel == "B") &&
    (model == "C" || model == "D")
  ) {
    changeRecaAmount(parameters.default_reca_amount);
  }

  // Keep reca amount when switching between C and D

  if (previousModel == "C" && model == "D") {
    parameters.real_reca_amount = parameters.reca_amount;
  }

  // Deactivate plasmid operons
  if (previousModel == "D") {
    turnOutPlasmidOperons();
    updatePlasmidDisplay();
  }

  if (model == "D") {
    updatePlasmidDisplay();
  }

  // Change recA control with DNA damage
  if (model == "D") {
    document.querySelector("#parameter-reca > span").innerHTML =
      "Input DNA damage";
    document.getElementById("reca-input").value = parameters.dna_damage;
  } else {
    document.querySelector("#parameter-reca > span").innerHTML = "recA";
    document.getElementById("reca-input").value = parameters.reca_amount;
  }

  // Resets plasmid expression
  if (previousModel != "D" && model == "D") {
    instanciateSosActivationLists();
  }
}

function turnOutLexaOperon() {
  parameters.lexa_dna_operon_active = false;
  if (!parameters.lexa_operon_is_free) {
    particle = parameters.lexa_particles[parameters.bound_particle_index];
    particle.is_bound = false;
    particle.bound_to = "";
    parameters.lexa_exists_list.push(particle.id);
    particle.time_to_unbind = 0;
    parameters.bound_particle_index = -1;
    parameters.lexa_operon_is_free = true;
    newSpeed = randomSpeed(parameters.lexa_speed);
    particle.vx = newSpeed.vx;
    particle.vy = newSpeed.vy;
    particle.time_to_rebind = parameters.time_to_rebind;
  }
}

function turnOutPlasmidOperons() {
  for (let i = 0; i < parameters.plasmid_operon_is_free.length; i++) {
    if (!parameters.plasmid_operon_is_free[i]) {
      particle =
        parameters.lexa_particles[parameters.plasmid_bound_particle_index[i]];

      particle.is_bound = false;
      particle.bound_to = "";
      parameters.lexa_exists_list.push(particle.id);
      particle.time_to_unbind = 0;
      parameters.plasmid_bound_particle_index[i] = -1;
      parameters.plasmid_operon_is_free[i] = true;
      newSpeed = randomSpeed(parameters.lexa_speed);
      particle.vx = newSpeed.vx;
      particle.vy = newSpeed.vy;
      particle.time_to_rebind = parameters.time_to_rebind;
    }
  }
}

function renderEquation(model) {
  var display1 = document.getElementById("equation-1");
  var display2 = document.getElementById("equation-2");
  katex.render(parameters["equation_1_model_" + model], display1);
  katex.render(parameters["equation_2_model_" + model], display2);
}

function renderDescription(model) {
  var display = document.getElementById("description");
  display.innerHTML = parameters["description_model_" + model];
}

function renderParameters(model) {
  model_number = 0;
  switch (model) {
    case "A":
      model_number = 0;
      break;
    case "B":
      model_number = 1;
      break;
    case "C":
      model_number = 2;
      break;
    case "D":
      model_number = 3;
      break;
  }

  if (model_number > 0) {
    document.getElementById("parameter-k").style.display = "flex";
    document.getElementById("legend-operon").style.display = "flex";
  } else {
    document.getElementById("parameter-k").style.display = "none";
    document.getElementById("legend-operon").style.display = "none";
  }

  if (model_number > 1) {
    document.getElementById("parameter-reca").style.display = "flex";
    document.getElementById("legend-reca").style.display = "flex";
    document.getElementById("reca-result-container").style.display = "flex";
  } else {
    document.getElementById("parameter-reca").style.display = "none";
    document.getElementById("legend-reca").style.display = "none";
    document.getElementById("reca-result-container").style.display = "none";
  }

  if (model_number > 2) {
    document.getElementById("legend-plasmid").style.display = "flex";
    document.getElementById("legend-sos-graph-1").style.display = "flex";
    document.getElementById("legend-sos-graph-2").style.display = "flex";
    document.getElementById("legend-sos-graph-3").style.display = "flex";
    document.getElementById("parameter-gamma").style.display = "flex";
    document.getElementById("parameter-delta").style.display = "flex";
    document.getElementById("parameter-sos-1").style.display = "flex";
    document.getElementById("parameter-sos-2").style.display = "flex";
    document.getElementById("parameter-sos-3").style.display = "flex";
    document.getElementById("sos-1-result-container").style.display = "flex";
    document.getElementById("sos-2-result-container").style.display = "flex";
    document.getElementById("sos-3-result-container").style.display = "flex";
    document.getElementById("repair-graph").style.display = "flex";
  } else {
    document.getElementById("legend-plasmid").style.display = "none";
    document.getElementById("legend-sos-graph-1").style.display = "none";
    document.getElementById("legend-sos-graph-2").style.display = "none";
    document.getElementById("legend-sos-graph-3").style.display = "none";
    document.getElementById("parameter-gamma").style.display = "none";
    document.getElementById("parameter-delta").style.display = "none";
    document.getElementById("parameter-sos-1").style.display = "none";
    document.getElementById("parameter-sos-2").style.display = "none";
    document.getElementById("parameter-sos-3").style.display = "none";
    document.getElementById("sos-1-result-container").style.display = "none";
    document.getElementById("sos-2-result-container").style.display = "none";
    document.getElementById("sos-3-result-container").style.display = "none";
    document.getElementById("repair-graph").style.display = "none";
  }
}

function instantiateHtml() {
  // Get parameter input objects
  var transcription_input = document.getElementById("transcription-input");
  var pause_input = document.getElementById("pause-input");
  var delta_t_input = document.getElementById("delta-t-input");
  var alpha_input = document.getElementById("alpha-input");
  var beta_input = document.getElementById("beta-input");
  var k_input = document.getElementById("k-input");
  var reca_input = document.getElementById("reca-input");
  var gamma_input = document.getElementById("gamma-input");
  var delta_input = document.getElementById("delta-input");
  var plasmid_1_k_input = document.getElementById("sos-1-input");
  var plasmid_2_k_input = document.getElementById("sos-2-input");
  var plasmid_3_k_input = document.getElementById("sos-3-input");

  // Set default values for input
  transcription_input.checked = parameters.transcription;
  pause_input.checked = parameters.pause;
  delta_t_input.value = parameters.delta_t;
  alpha_input.value = parameters.lexa_desintegration_rate;
  beta_input.value = parameters.lexa_production_rate;
  k_input.value = parameters.pseudo_k;
  reca_input.value = parameters.reca_amount;
  gamma_input.value = parameters.reca_production_rate;
  delta_input.value = parameters.reca_desintegration_rate;
  plasmid_1_k_input.value = parameters.plasmid_pseudo_k[0];
  plasmid_2_k_input.value = parameters.plasmid_pseudo_k[1];
  plasmid_3_k_input.value = parameters.plasmid_pseudo_k[2];

  // Add event listeners to input
  transcription_input.addEventListener("change", function () {
    parameters.transcription = transcription_input.checked;
  });

  pause_input.addEventListener("change", function () {
    parameters.pause = pause_input.checked;
    if (!parameters.pause) {
      simulationLoop();
    }
  });

  addDelayedListener(delta_t_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      parameters.delta_t = floatValue;
    }
  });

  addDelayedListener(alpha_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      parameters.lexa_desintegration_rate = floatValue;
    }
  });

  addDelayedListener(beta_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_production_rate) {
        floatValue = parameters.max_production_rate;
        beta_input.value = parameters.max_production_rate;
      }
      if (floatValue < parameters.min_production_rate) {
        floatValue = parameters.min_production_rate;
        beta_input.value = parameters.min_production_rate;
      }

      parameters.lexa_production_rate = floatValue;
      if (floatValue != 0) {
        parameters.lexa_production_cooldown = Math.floor(100 / floatValue);
      }
    }
  });

  addDelayedListener(k_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_pseudo_k) {
        floatValue = parameters.max_pseudo_k;
        k_input.value = parameters.max_pseudo_k;
      }
      if (floatValue < parameters.min_pseudo_k) {
        floatValue = parameters.min_pseudo_k;
        k_input.value = parameters.min_pseudo_k;
      }
      parameters.pseudo_k = floatValue;
      parameters.time_to_unbind = Math.floor(1 / floatValue);
    }
  });

  addDelayedListener(reca_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    // Input can be either recA amount or DNA damage
    if (parameters.selected_model != "D") {
      if (!isNaN(floatValue)) {
        if (floatValue > parameters.reca_max_amount) {
          floatValue = parameters.reca_max_amount;
          reca_input.value = parameters.reca_max_amount;
        }
        if (floatValue < 0) {
          floatValue = 0;
          reca_input.value = 0;
        }
        changeRecaAmount(floatValue);
      }
    } else {
      if (!isNaN(floatValue)) {
        if (floatValue > parameters.max_dna_damage) {
          floatValue = parameters.max_dna_damage;
          reca_input.value = parameters.max_dna_damage;
        }
        if (floatValue < parameters.min_dna_damage) {
          floatValue = parameters.max_dna_damage;
          reca_input.value = parameters.max_dna_damage;
        }
        parameters.dna_damage = floatValue;
      }
    }
  });

  addDelayedListener(gamma_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_reca_production_rate) {
        floatValue = parameters.max_reca_production_rate;
        gamma_input.value = parameters.max_reca_production_rate;
      }
      if (floatValue < parameters.min_reca_production_rate) {
        floatValue = parameters.min_reca_production_rate;
        gamma_input.value = parameters.min_reca_production_rate;
      }
      parameters.reca_production_rate = floatValue;
    }
  });

  addDelayedListener(delta_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_reca_desintegration_rate) {
        floatValue = parameters.max_reca_desintegration_rate;
        delta_input.value = parameters.max_reca_desintegration_rate;
      }
      if (floatValue < parameters.min_reca_desintegration_rate) {
        floatValue = parameters.min_reca_desintegration_rate;
        delta_input.value = parameters.min_reca_desintegration_rate;
      }
      parameters.reca_desintegration_rate = floatValue;
    }
  });

  addDelayedListener(plasmid_1_k_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_pseudo_k) {
        floatValue = parameters.max_pseudo_k;
        plasmid_1_k_input.value = parameters.max_pseudo_k;
      }
      if (floatValue < parameters.min_pseudo_k) {
        floatValue = parameters.min_pseudo_k;
        plasmid_1_k_input.value = parameters.min_pseudo_k;
      }
      parameters.plasmid_time_to_unbind[0] = Math.floor(1 / floatValue);
      parameters.plasmid_pseudo_k[0] = floatValue;
    }
  });

  addDelayedListener(plasmid_2_k_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_pseudo_k) {
        floatValue = parameters.max_pseudo_k;
        plasmid_2_k_input.value = parameters.max_pseudo_k;
      }
      if (floatValue < parameters.min_pseudo_k) {
        floatValue = parameters.min_pseudo_k;
        plasmid_2_k_input.value = parameters.min_pseudo_k;
      }
      parameters.plasmid_time_to_unbind[1] = Math.floor(1 / floatValue);
      parameters.plasmid_pseudo_k[1] = floatValue;
    }
  });

  addDelayedListener(plasmid_3_k_input, function (finalValue) {
    var floatValue = parseFloat(finalValue);
    if (!isNaN(floatValue)) {
      if (floatValue > parameters.max_pseudo_k) {
        floatValue = parameters.max_pseudo_k;
        plasmid_3_k_input.value = parameters.max_pseudo_k;
      }
      if (floatValue < parameters.min_pseudo_k) {
        floatValue = parameters.min_pseudo_k;
        plasmid_3_k_input.value = parameters.min_pseudo_k;
      }
      parameters.plasmid_time_to_unbind[2] = Math.floor(1 / floatValue);
      parameters.plasmid_pseudo_k[2] = floatValue;
    }
  });

  // Add legend
  d3.select("#legend-lexa")
    .select("svg")
    .append("circle")
    .attr("r", parameters.lexa_radius)
    .attr("fill", parameters.lexa_color)
    .attr("cx", 20)
    .attr("cy", 10);

  const lexa_dna_legend = `
    M0,${parameters.legend_dna_curve_radius}
    A${parameters.legend_dna_curve_radius},${
    parameters.legend_dna_curve_radius
  } 0 0,1 ${parameters.legend_dna_curve_radius},0
    L${parameters.legend_dna_length - parameters.legend_dna_curve_radius},0
    A${parameters.legend_dna_curve_radius},${
    parameters.legend_dna_curve_radius
  } 0 0,1 ${parameters.legend_dna_length},${parameters.legend_dna_curve_radius}
    L${parameters.legend_dna_length},${
    parameters.legend_dna_height - parameters.legend_dna_curve_radius
  }
    A${parameters.legend_dna_curve_radius},${
    parameters.legend_dna_curve_radius
  } 0 0,1 ${
    parameters.legend_dna_length - parameters.legend_dna_curve_radius
  },${parameters.legend_dna_height}
    L${parameters.legend_dna_curve_radius},${parameters.legend_dna_height}
    A${parameters.legend_dna_curve_radius},${
    parameters.legend_dna_curve_radius
  } 0 0,1 0,${parameters.legend_dna_height - parameters.legend_dna_curve_radius}
    L0,${parameters.legend_dna_curve_radius}
    Z`;

  d3.select("#legend-chromosome")
    .select("svg")
    .append("g")
    .attr(
      "transform",
      `translate(${(40 - parameters.legend_dna_length) / 2},${
        (20 - parameters.legend_dna_height) / 2
      })`
    )
    .append("path")
    .attr("d", lexa_dna_legend)
    .style("fill", parameters.dna_color);

  d3.select("#legend-operon")
    .select("svg")
    .append("g")
    .attr(
      "transform",
      `translate(${(40 - parameters.legend_dna_length) / 2},${
        (20 - parameters.legend_dna_height) / 2
      })`
    )
    .append("path")
    .attr("d", lexa_dna_legend)
    .style("fill", parameters.operon_color);

  d3.select("#legend-reca")
    .select("svg")
    .append("circle")
    .attr("r", parameters.reca_radius)
    .attr("fill", parameters.reca_color)
    .attr("cx", 20)
    .attr("cy", 10);

  d3.select("#legend-plasmid")
    .select("svg")
    .append("circle")
    .attr("cx", 20)
    .attr("cy", 10)
    .attr("r", 8)
    .attr("stroke", parameters.dna_color)
    .attr("stroke-width", 3)
    .attr("fill", "none");

  d3.select("#legend-sos-graph-1")
    .select("svg")
    .append("rect")
    .attr("width", 30)
    .attr("height", 1)
    .attr("x", 5)
    .attr("y", 9.5)
    .attr("fill", "red");

  d3.select("#legend-sos-graph-2")
    .select("svg")
    .append("rect")
    .attr("width", 30)
    .attr("height", 1)
    .attr("x", 5)
    .attr("y", 9.5)
    .attr("fill", "blue");

  d3.select("#legend-sos-graph-3")
    .select("svg")
    .append("rect")
    .attr("width", 30)
    .attr("height", 1)
    .attr("x", 5)
    .attr("y", 9.5)
    .attr("fill", "green");
}

function addDelayedListener(input_element, callback) {
  let inputTimer;

  input_element.addEventListener("input", function () {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(function () {
      const finalValue = input_element.value;
      callback(finalValue);
    }, parameters.input_delay);
  });
}

function changeRecaAmount(reca_amount) {
  const previousRecaAmount = parameters.reca_amount;
  parameters.reca_amount = reca_amount;

  if (reca_amount < previousRecaAmount) {
    i = 0;
    to_delete = previousRecaAmount - reca_amount;
    while (to_delete > 0 && i < parameters.reca_particles.length) {
      if (
        parameters.reca_particles[i].exists ||
        parameters.reca_particles[i].spawning
      ) {
        parameters.reca_particles[i].exists = false;
        parameters.reca_particles[i].just_died = 2;
        parameters.reca_particles[i].spawning = false;
        parameters.reca_particles[i].spawn_state = 0;
        to_delete -= 1;
      }
      i += 1;
    }
    if (to_delete > 0) {
      console.error("Not enough reca particles to delete");
    }
  }

  if (reca_amount > previousRecaAmount) {
    addRecaToSimulation(reca_amount - previousRecaAmount);
  }

  parameters.reca_amount = reca_amount;

  if (parameters.selected_model != "D") {
    document.getElementById("reca-input").value = reca_amount;
  }
}

function addRecaToSimulation(amount) {
  for (let i = 0; i < amount; i++) {
    const free_reca_index = getFreeReca();
    if (free_reca_index != -1) {
      parameters.reca_particles[free_reca_index].spawn_goal_x =
        Math.random() * (parameters.w - 2 * parameters.out_of_bounds) +
        parameters.out_of_bounds;
      parameters.reca_particles[free_reca_index].spawn_goal_y =
        Math.random() * (parameters.h - 2 * parameters.out_of_bounds) +
        parameters.out_of_bounds;
      parameters.reca_particles[free_reca_index].spawning = true;
      parameters.reca_particles[free_reca_index].spawn_state = 0;
    } else {
      console.error("Maximum number of reca particles reached");
    }
  }
}

function updateResults() {
  document.getElementById("lexa-result").innerHTML =
    "[lexA] : " + parameters.lexa_amount;

  if (parameters.selected_model == "D" || parameters.selected_model == "C") {
    document.getElementById("reca-result").innerHTML =
      "[recA] : " + parameters.reca_amount;
  }

  if (parameters.selected_model == "D") {
    document.getElementById("sos-1-result").innerHTML =
      "SOS 1 : " +
      (
        (parameters.sos_1_activation_count /
          parameters.plasmid_expression_time_lapse) *
        100
      ).toFixed(1) +
      "% of activation";

    document.getElementById("sos-2-result").innerHTML =
      "SOS 2 : " +
      (
        (parameters.sos_2_activation_count /
          parameters.plasmid_expression_time_lapse) *
        100
      ).toFixed(1) +
      "% of activation";

    document.getElementById("sos-3-result").innerHTML =
      "SOS 3 : " +
      (
        (parameters.sos_3_activation_count /
          parameters.plasmid_expression_time_lapse) *
        100
      ).toFixed(1) +
      "% of activation";

    document.getElementById("dna-damage-result").innerHTML =
      "DNA damage : " + parameters.dna_damage.toFixed(2);
  }
}

function sosActivationUpdate() {
  if (parameters.plasmid_operon_is_free[0]) {
    if (
      !parameters.sos_1_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_1_activation_count += 1;
    }
    parameters.sos_1_activation_list[
      parameters.sos_activation_list_current_index
    ] = true;
  } else {
    if (
      parameters.sos_1_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_1_activation_count -= 1;
    }
    parameters.sos_1_activation_list[
      parameters.sos_activation_list_current_index
    ] = false;
  }

  if (parameters.plasmid_operon_is_free[1]) {
    if (
      !parameters.sos_2_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_2_activation_count += 1;
    }
    parameters.sos_2_activation_list[
      parameters.sos_activation_list_current_index
    ] = true;
  } else {
    if (
      parameters.sos_2_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_2_activation_count -= 1;
    }
    parameters.sos_2_activation_list[
      parameters.sos_activation_list_current_index
    ] = false;
  }

  if (parameters.plasmid_operon_is_free[2]) {
    if (
      !parameters.sos_3_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_3_activation_count += 1;
    }
    parameters.sos_3_activation_list[
      parameters.sos_activation_list_current_index
    ] = true;
  } else {
    if (
      parameters.sos_3_activation_list[
        parameters.sos_activation_list_current_index
      ]
    ) {
      parameters.sos_3_activation_count -= 1;
    }
    parameters.sos_3_activation_list[
      parameters.sos_activation_list_current_index
    ] = false;
  }

  parameters.sos_activation_list_current_index += 1;
  if (
    parameters.sos_activation_list_current_index ==
    parameters.plasmid_expression_time_lapse
  ) {
    parameters.sos_activation_list_current_index = 0;
  }
}

function DNA_repair() {
  const sos_1_threshold = Math.min(
    Math.floor(
      (parameters.sos_1_activation_count /
        parameters.plasmid_expression_time_lapse) *
        parameters.plasmid_thresholds[0].length
    ),
    parameters.plasmid_thresholds[0].length - 1
  );

  const sos_2_threshold = Math.min(
    Math.floor(
      (parameters.sos_2_activation_count /
        parameters.plasmid_expression_time_lapse) *
        parameters.plasmid_thresholds[1].length
    ),
    parameters.plasmid_thresholds[1].length - 1
  );

  const sos_3_threshold = Math.min(
    Math.floor(
      (parameters.sos_3_activation_count /
        parameters.plasmid_expression_time_lapse) *
        parameters.plasmid_thresholds[2].length
    ),
    parameters.plasmid_thresholds[2].length - 1
  );

  parameters.dna_damage -=
    parameters.plasmid_thresholds[0][sos_1_threshold] *
      parameters.repair_weight_coefficient +
    parameters.plasmid_thresholds[1][sos_2_threshold] *
      parameters.repair_weight_coefficient +
    parameters.plasmid_thresholds[2][sos_3_threshold] *
      parameters.repair_weight_coefficient;

  parameters.repair_1_history.push(
    parameters.plasmid_thresholds[0][sos_1_threshold]
  );
  parameters.repair_1_history.shift();

  parameters.repair_2_history.push(
    parameters.plasmid_thresholds[1][sos_2_threshold]
  );
  parameters.repair_2_history.shift();

  parameters.repair_3_history.push(
    parameters.plasmid_thresholds[2][sos_3_threshold]
  );
  parameters.repair_3_history.shift();

  if (parameters.dna_damage < 0) {
    parameters.dna_damage = 0;
  }
}

function drawLexaGraph() {
  const data = parameters.lexa_amount_history;
  const base_width = document
    .getElementById("lexa-graph")
    .getBoundingClientRect().width;
  const base_height = document
    .getElementById("lexa-graph")
    .getBoundingClientRect().height;

  // Set up dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = base_width - margin.left - margin.right;
  const height = base_height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data) * 1.1])
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

  // Append SVG element
  const svg = d3
    .select("#lexa-graph")
    .append("g")
    .attr("id", "lexa-graph-svg")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Draw line
  svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("stroke", "black")
    .attr("fill", "none");

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickValues([]));

  // Add y-axis
  svg.append("g").attr("id", "lexa-y-axis").call(d3.axisLeft(yScale).ticks(5));

  // Add x-axis label
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 10)
    .text("Time");

  // Add y-axis label
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 12)
    .attr("x", -margin.top)
    .text("[lexA]");
}
7;

function updateLexaGraph() {
  const newData = parameters.lexa_amount_history;

  const base_width = document
    .getElementById("lexa-graph")
    .getBoundingClientRect().width;
  const base_height = document
    .getElementById("lexa-graph")
    .getBoundingClientRect().height;

  // Set up dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = base_width - margin.left - margin.right;
  const height = base_height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([0, newData.length - 1])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(newData) * 1.1])
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

  // Select SVG element
  const svg = d3.select("#lexa-graph-svg");

  // Update the path
  svg.select("path").datum(newData).attr("d", line).attr("stroke", "black");

  // Update the y-axis
  d3.select("#lexa-y-axis").call(d3.axisLeft(yScale).ticks(5));
}

function drawRepairGraph() {
  const data1 = parameters.repair_1_history;
  const data2 = parameters.repair_2_history;
  const data3 = parameters.repair_3_history;

  const base_width = document
    .getElementById("repair-graph")
    .getBoundingClientRect().width;
  const base_height = document
    .getElementById("repair-graph")
    .getBoundingClientRect().height;

  // Set up dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = base_width - margin.left - margin.right;
  const height = base_height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([0, data1.length - 1])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(d3.max(data1), d3.max(data2), d3.max(data3)) * 1.1])
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

  // Append SVG element
  const svg = d3
    .select("#repair-graph")
    .append("g")
    .attr("id", "repair-graph-svg")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Draw line
  svg
    .append("path")
    .datum(data1)
    .attr("d", line)
    .attr("id", "repair-graph-line-1")
    .attr("stroke", "red")
    .attr("fill", "none");

  svg
    .append("path")
    .datum(data2)
    .attr("d", line)
    .attr("id", "repair-graph-line-2")
    .attr("stroke", "blue")
    .attr("fill", "none");

  svg
    .append("path")
    .datum(data3)
    .attr("d", line)
    .attr("id", "repair-graph-line-3")
    .attr("stroke", "green")
    .attr("fill", "none");

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickValues([]));

  // Add y-axis
  svg
    .append("g")
    .attr("id", "repair-y-axis")
    .call(d3.axisLeft(yScale).ticks(5));

  // Add x-axis label
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 10)
    .text("Time");

  // Add y-axis label
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 12)
    .attr("x", -margin.top)
    .text("Repair / frame (e-4)");
}

function updateRepairGraph() {
  const newData1 = parameters.repair_1_history;
  const newData2 = parameters.repair_2_history;
  const newData3 = parameters.repair_3_history;

  console.log(newData1);

  const base_width = document
    .getElementById("repair-graph")
    .getBoundingClientRect().width;
  const base_height = document
    .getElementById("repair-graph")
    .getBoundingClientRect().height;

  // Set up dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = base_width - margin.left - margin.right;
  const height = base_height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([0, newData1.length - 1])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(d3.max(newData1), d3.max(newData2), d3.max(newData3)) * 1.1,
    ])
    .range([height, 0]);

  // Create line generator
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

  // Select SVG element
  const svg = d3.select("#repair-graph-svg");

  // Update the path
  svg
    .select("#repair-graph-line-1")
    .datum(newData1)
    .attr("d", line)
    .attr("stroke", "red");
  svg
    .select("#repair-graph-line-2")
    .datum(newData2)
    .attr("d", line)
    .attr("stroke", "blue");
  svg
    .select("#repair-graph-line-3")
    .datum(newData3)
    .attr("d", line)
    .attr("stroke", "green");

  // Update the y-axis
  d3.select("#repair-y-axis").call(d3.axisLeft(yScale).ticks(5));
}

function updateLexaHistory() {
  parameters.lexa_amount_history.push(parameters.lexa_amount);
  parameters.lexa_amount_history.shift();
}
