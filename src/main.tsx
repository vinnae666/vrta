import 'simplebar';

import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ThemeConfig from '@/theme';
import ScrollToTop from '@/components/ScrollToTop';
import Router from '@/routes';
import ReactJson from "react-json-view";
import { Currency } from "@dataverse/dataverse-connector";
import {
  StreamType,
  useApp,
  useCreateStream,
  useFeedsByAddress,
  useMonetizeStream,
  useStore,
  useUnlockStream,
  useUpdateStream,
} from "@dataverse/hooks";
import { Model, ModelParser, Output } from "@dataverse/model-parser";
import { DataverseContextProvider } from "@dataverse/hooks";
import app from "../output/app.json";
import pacakage from "../package.json";



const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);

const App = () => {

  const [postModel, setPostModel] = useState<Model>();
  const [currentStreamId, setCurrentStreamId] = useState<string>();

  useEffect(() => {
    const postModel = modelParser.getModelByName("post");
    setPostModel(postModel);
  }, []);

  /**
   * @summary import from @dataverse/hooks
   */
  const {
    state: { address, pkh, streamsMap: posts },
  } = useStore();

  const { connectApp } = useApp({
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createdStream: publicPost, createStream: createPublicStream } = useCreateStream({
    streamType: StreamType.Public,
    onSuccess: (result: any) => {
      console.log("[createPublicPost]create public stream success:", result);
      setCurrentStreamId(result.streamId);
    },
  });

  const { createdStream: encryptedPost, createStream: createEncryptedStream } =
    useCreateStream({
      streamType: StreamType.Encrypted,
      onSuccess: (result: any) => {
        console.log(
          "[createEncryptedPost]create encrypted stream success:",
          result
        );
        setCurrentStreamId(result.streamId);
      },
    });

  const { createdStream: payablePost, createStream: createPayableStream } = useCreateStream({
    streamType: StreamType.Payable,
    onSuccess: (result: any) => {
      console.log("[createPayablePost]create payable stream success:", result);
      setCurrentStreamId(result.streamId);
    },
  });

  const { loadFeedsByAddress } = useFeedsByAddress({
    onError: (error) => {
      console.error("[loadPosts]load streams failed,", error);
    },
    onSuccess: (result) => {
      console.log("[loadPosts]load streams success, result:", result);
    },
  });

  const { updatedStreamContent: updatedPost, updateStream } = useUpdateStream({
    onSuccess: (result) => {
      console.log("[updatePost]update stream success, result:", result);
    },
  });

  const { monetizedStreamContent: monetizedPost, monetizeStream } = useMonetizeStream({
    onSuccess: (result) => {
      console.log("[monetize]monetize stream success, result:", result);
    },
  });

  const { unlockedStreamContent: unlockedPost, unlockStream } = useUnlockStream({
    onSuccess: (result) => {
      console.log("[unlockPost]unlock stream success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp({
      appId: modelParser.appId,
    });
  }, [modelParser]);

  const createPublicPost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    createPublicStream({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      stream: {
        appVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }, [postModel]);

  const createEncryptedPost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    const date = new Date().toISOString();

    createEncryptedStream({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      stream: {
        appVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  }, [postModel]);

  const createPayablePost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    const date = new Date().toISOString();
    createPayableStream({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      stream: {
        appVersion,
        text: "metaverse",
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link/",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
      },
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  }, [postModel, address, pkh]);

  const loadPosts = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh) {
      console.error("pkh undefined");
      return;
    }

    await loadFeedsByAddress({
      pkh,
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
    });
  }, [postModel, pkh]);

  const updatePost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    updateStream({
      model: postModel,
      streamId: currentStreamId,
      stream: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  }, [postModel, currentStreamId]);

  const monetizePost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }

    monetizeStream({
      streamId: currentStreamId,
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
    });
  }, [postModel, currentStreamId]);

  const unlockPost = useCallback(async () => {
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    unlockStream(currentStreamId);
  }, [currentStreamId]);

  return (
        <ThemeConfig>
            <ScrollToTop />
      
            <Router />
     
        </ThemeConfig>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <HelmetProvider>
        <BrowserRouter>
          <DataverseContextProvider>
            <App />
         </DataverseContextProvider>
        </BrowserRouter>
   </HelmetProvider>
);
