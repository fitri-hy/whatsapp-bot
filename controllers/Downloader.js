const { exec } = require('youtube-dl-exec');
const path = require('path');


const ffmpegLocation = path.join(__dirname, '../plugin/ffmpeg.exe');

const YoutubeVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error downloading video: ${error.message}`);
    throw error;
  }
};

const YoutubeAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading audio: ${error.message}`);
    throw error;
  }
};

const FacebookVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error mengunduh video Facebook: ${error.message}`);
    throw error;
  }
};

const FacebookAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading audio: ${error.message}`);
    throw error;
  }
};

const TwitterVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error downloading Twitter video: ${error.message}`);
    throw error;
  }
};

const TwitterAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading Twitter audio: ${error.message}`);
    throw error;
  }
};

const InstagramVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error downloading Instagram video: ${error.message}`);
    throw error;
  }
};

const InstagramAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading Instagram audio: ${error.message}`);
    throw error;
  }
};

const TikTokVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error downloading TikTok video: ${error.message}`);
    throw error;
  }
};

const TikTokAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading TikTok audio: ${error.message}`);
    throw error;
  }
};

const VimeoVideo = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      format: 'mp4',
    });
  } catch (error) {
    console.error(`Error downloading Vimeo video: ${error.message}`);
    throw error;
  }
};

const VimeoAudio = async (url, outputFilePath) => {
  try {
    await exec(url, {
      output: outputFilePath,
      ffmpegLocation,
      extractAudio: true,
      audioFormat: 'mp3',
    });
  } catch (error) {
    console.error(`Error downloading Vimeo audio: ${error.message}`);
    throw error;
  }
};

module.exports = { 
	YoutubeVideo, YoutubeAudio, 
	FacebookVideo, FacebookAudio, 
	TwitterVideo, TwitterAudio, 
	InstagramVideo, InstagramAudio, 
	TikTokVideo, TikTokAudio, 
	VimeoVideo, VimeoAudio 
};
