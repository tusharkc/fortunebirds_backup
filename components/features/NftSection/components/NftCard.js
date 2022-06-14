import Image from "next/image";
import React from "react";
import { useContext } from "react";
import { NftContext } from "../../../../context/NftContext";
import { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useEffect } from "react";
import { WAX_PINK_END_POINT } from "../../../constants/constants";
import axios from "axios";
import { imgSrc } from "../../imgSrc";

const NftCard = ({
  nftSrc,
  campaignId,
  creator,
  loopTimeSeconds,
  totalEntriesStart,
  totalEntriesEnd,
  entryCost,
  contractAccount,
  lastRoll,
  isVideo,
  videoNftUrl,
  assetId,
  joinedAccounts,
}) => {
  const {
    joinCampaign,
    isTransactionSussessful,
    erroMsg,
    transactionId,
    setIsTransactionSussessful,
    userAccount,
  } = useContext(NftContext);

  const [showAlert, setShowAlert] = useState(false);
  const [showTransactionMessage, setShowTransactionMessage] = useState(false);
  const [showNotLoggedInMsg, setShowNotLoggedInMsg] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [timeToShow, setTimeToShow] = useState("");

  const [openModal, setOpenModal] = useState(true);

  const [timeCountDown, setTimeCountDown] = useState(15);

  useEffect(() => {
    if (transactionId) {
      setShowTransactionMessage(true);
      setShowErrorMessage(false);
    } else if (erroMsg != "") {
      setShowErrorMessage(true);
      setShowTransactionMessage(false);
      console.log(erroMsg);
    }
  }, [transactionId]);

  useEffect(() => {
    if (totalEntriesEnd != totalEntriesStart) {
      updateTimeToShow(finalUTCEpochTimeInMilliSec);
    } else {
      setTimeToShow("Reveal Winner");
    }
  }, [timeToShow, totalEntriesEnd, totalEntriesStart]);

  const updateTimeToShow = (finalUTCEpochTimeInMilliSec) => {
    let interval = setInterval(() => {
      const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();
      let distance = finalUTCEpochTimeInMilliSec - nowUTCEpochTimeInMilliSec;

      if (distance < 0) distance = 0;
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeToShow(
        `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`
      );

      if (distance <= 0) {
        clearInterval(interval);
        setTimeToShow("Reveal Winner");
      }
    }, 1000);
  };
  const finalUTCEpochTimeInMilliSec =
    Date.parse(`${lastRoll}Z`) + loopTimeSeconds * 1000;

  return (
    <>
      <SweetAlert
        style={{ background: "#14181d", color: "white" }}
        title="Please Login to join the campaign"
        show={showNotLoggedInMsg}
        showConfirm={false}
        onConfirm={() => {}}
      >
        <button
          className="py-3"
          onClick={() => {
            setShowNotLoggedInMsg(false);
          }}
        >
          OK
        </button>
      </SweetAlert>

      <SweetAlert
        custom
        title=""
        show={showAlert}
        onConfirm={() => {}}
        style={{ backgroundColor: "#1d2228", color: "white" }}
        customButtons={
          <>
            <button
              onClick={async () => {
                await joinCampaign(
                  contractAccount,
                  campaignId,
                  entryCost,
                  assetId,
                  joinedAccounts,
                  totalEntriesStart
                ).then(() => {
                  setShowAlert(false);
                });
              }}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              SEND
            </button>

            <button
              onClick={() => {
                setShowAlert(false);
              }}
              style={{ backgroundColor: "#6e7881" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              CANCEL
            </button>
          </>
        }
      >
        {!isVideo ? (
          <>
            <Image
              height={110}
              width={"100%"}
              loading="lazy"
              src={nftSrc}
              objectFit={"fill"}
              layout={"responsive"}
            />
          </>
        ) : (
          <video
            width={"100%"}
            className="video_nft object-cover"
            muted
            autoPlay
            controls=""
          >
            <source src={videoNftUrl} type="video/mp4" />
            <source src={videoNftUrl} type="video/ogg" />
          </video>
        )}

        <p className="pt-5">
          To participate in this Campaign ID : {campaignId} you&apos;re about to
          send {entryCost}
        </p>
      </SweetAlert>

      {isTransactionSussessful ? (
        <SweetAlert
          success
          show={showTransactionMessage}
          style={{ color: "white", backgroundColor: "#1d2228" }}
          title="Successfully Joined!"
          onConfirm={() => {}}
          customButtons={
            <>
              <button
                onClick={() => {
                  setIsTransactionSussessful(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>Transaction Id : {transactionId} </p>
        </SweetAlert>
      ) : erroMsg != "" ? (
        <SweetAlert
          danger
          show={showErrorMessage}
          style={{ backgroundColor: "#1d2228", color: "white" }}
          title=""
          onConfirm={() => {}}
          customButtons={
            <>
              <button
                onClick={() => {
                  setShowErrorMessage(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>{erroMsg}</p>
        </SweetAlert>
      ) : (
        ""
      )}

      <div className="rounded nft_card_container">
        <a
          href={`https://wax.atomichub.io/explorer/asset/${assetId}`}
          target="_blank"
          rel="noreferrer"
        >
          {!isVideo ? (
            <>
              <Image
                height={110}
                width={"100%"}
                loading="lazy"
                src={nftSrc}
                objectFit={"fill"}
                layout={"responsive"}
              />
            </>
          ) : (
            <div>
              <video
                height="326px"
                width={"100%"}
                className="video_nft object-cover"
                autoPlay
                muted
                controls=""
              >
                <source src={`${videoNftUrl}`} type="video/mp4" />
                <source src={`${videoNftUrl}`} type="video/ogg" />
              </video>
            </div>
          )}
        </a>

        <div className="nft_card_content_container text-center">
          <h2 className="nft_card_campaign_id">Campaign Id: {campaignId}</h2>
          <p className="text-white nft_card_autho_name">by {creator}</p>

          <div className="nft_card_content_time_container text-white mx-1">
            <p className="time_to_role_text">Time to Roll</p>

            <button
              className={`${
                timeToShow == "Reveal Winner"
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
              onClick={() => {
                let counter = 16;
                setInterval(function () {
                  counter--;
                  if (counter >= 0) {
                    setTimeCountDown(counter);
                  }
                  if (counter === 0) {
                    clearInterval(counter);
                    setTimeCountDown(0);
                  }
                }, 1000);
                setShowWinner(true);
              }}
            >
              <h1 className="nft_card_content_time">{timeToShow}</h1>
            </button>
          </div>

          <p className="total_entries_container text-white font-normal">
            ✔ Total Entries: {totalEntriesStart}/{totalEntriesEnd}
          </p>

          <p className="entry_cost_container text-white font-normal">
            ✔ Entry Cost: {entryCost}
          </p>

          <button
            onClick={() => {
              userAccount ? setShowAlert(true) : setShowNotLoggedInMsg(true);
            }}
            className={`my-2.5 ${
              timeToShow == "Reveal Winner"
                ? "bg-zinc-500 py-2 px-2 rounded-md text-white pointer-events-none"
                : "join_campaign_now_btn"
            }`}
          >
            {timeToShow == "Reveal Winner" ? "ENDED" : "JOIN NOW"}
          </button>
          <div className="entrants_container cursor-pointer">
            <p className="entrants_counter font-semibold py-2.5">Entrants</p>

            {joinedAccounts?.length > 0 ? (
              joinedAccounts.map((item, index) => {
                return (
                  <p
                    key={index}
                    className="py-2 my-2 hidden entrants_indicator rounded text-white"
                  >
                    {item}
                  </p>
                );
              })
            ) : (
              <p className="py-2 hidden entrants_indicator rounded text-white">
                No Entrants So Far
              </p>
            )}
          </div>
        </div>
      </div>
      {showWinner && (
        <GetWinnerWhenExpired
          campaignIdToFindWith={campaignId}
          assetIdToFindWith={assetId}
          openModal={openModal}
          timeCountDown={timeCountDown}
          handleClose={() => {
            setShowWinner(false);
          }}
        />
      )}
    </>
  );
};

export default NftCard;

const GetWinnerWhenExpired = ({
  assetIdToFindWith = "",
  campaignIdToFindWith = "",
  openModal = true,
  timeCountDown,
  handleClose,
}) => {
  const [currentWinnerUser, setCurrentWinnerUser] = useState("");
  const [imgSrcFinal, setImgSrcFinal] = useState("");

  useEffect(() => {
    getWinnerUser();
  }, []);

  const getWinnerUser = async () => {
    const response = await axios.post(
      `${WAX_PINK_END_POINT}/v1/chain/get_table_rows`,
      {
        json: true,
        code: "fortunebirds",
        scope: "fortunebirds",
        table: "results",
        limit: 1000,
      }
    );

    let campaignDataOnExpire = await response.data?.rows;

    const currentWinner = campaignDataOnExpire?.filter((item) => {
      return (
        item?.asset_id == assetIdToFindWith &&
        item?.campaign_id == campaignIdToFindWith
      );
    });

    setCurrentWinnerUser(() => currentWinner[0]?.winner);
  };

  useEffect(() => {
    randomImageSelector(imgSrc);
  }, [imgSrcFinal]);

  const randomImageSelector = (items) => {
    const imgSrcFromArray = items[Math.floor(Math.random() * items.length)];
    setImgSrcFinal(imgSrcFromArray);
  };

  return (
    <>
      <SweetAlert
        custom
        onConfirm={() => {}}
        title=""
        show={openModal}
        style={{ backgroundColor: "#1d2228", color: "white" }}
        customButtons={
          <>
            <button
              onClick={handleClose}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              OK
            </button>
          </>
        }
      >
        <img src={`${imgSrcFinal}`} />

        <p className="pt-5">
          {timeCountDown <= 0
            ? `Winner of the contest is ${currentWinnerUser}`
            : ` Revealing the winner in ${timeCountDown}`}
        </p>
      </SweetAlert>
    </>
  );
};
