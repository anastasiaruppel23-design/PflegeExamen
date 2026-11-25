/* Transcribe saved audio locally. Only the model and its runtime are downloaded. */
const libraryUrl = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';
let transcriber;

async function loadTranscriber() {
  const {env, pipeline} = await import(libraryUrl);
  env.allowLocalModels = false;
  env.backends.onnx.wasm.numThreads = 1;
  return pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny', {
    revision: 'ff4177021cc41f7db950912b73ea4fdf7d01d8e7',
    device: 'wasm',
    dtype: 'q8'
  });
}

self.onmessage = async ({data: samples}) => {
  let phase = 'loading';
  try {
    transcriber ??= await loadTranscriber();
    phase = 'transcribing';
    self.postMessage({status:'running'});
    const {text} = await transcriber(samples, {
      language: 'german',
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
      no_repeat_ngram_size: 5
    });
    self.postMessage({status:'done', text});
  } catch {
    self.postMessage({status:'error', phase});
  }
};
