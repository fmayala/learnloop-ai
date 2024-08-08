class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
      if (input && input.length > 0 && output && output.length > 0) {
        for (let channel = 0; channel < input.length; channel++) {
          output[channel].set(input[channel]);
        }
      }
      return true; // Keep the processor alive
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
  