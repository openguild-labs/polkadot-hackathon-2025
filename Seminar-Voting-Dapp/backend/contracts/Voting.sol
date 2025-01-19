// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./SeminarNFT.sol";
import "./Whitelist.sol";

contract Voting is Initializable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    struct VotingRound {
        uint256 startTime;
        uint256 endTime;
        uint256 maxVotesPerVoterForSeminar; // max vote
        uint256 maxVotesPerVoterForSpeaker;
        bool isActive;
        uint256[] seminarIds;
        address[] speakersInRound;
        mapping(address => uint256) speakerVotes; // speakerVotes[speakerAddress] = number of votes
        address[] votersForSeminar; // danh sách người đã bỏ phiếu cho seminar
        address[] votersForSpeaker; // danh sách người đã bỏ phiếu cho speaker
        mapping(uint256 => bool) seminarExist; //seminarExist[seminarId] = true/false
        mapping(address => bool) speakerExist; //speakerExist[speakerAddress] = true/false
        mapping(uint256 => mapping(address => bool)) checkVotedSeminar; // checkVoted[seminarId][voter] = true/false
        mapping(address => mapping(address => bool)) checkVotedSpeaker; // checkVoted[speakerAddress][voter] = true/false
    }
    SeminarNFT public seminarNFT;
    WhitelistUpgradeableV2 public whitelist;

    mapping(uint256 => VotingRound) public votingRounds; // roundId => VotingRound
    mapping(uint256 => mapping(address => uint256)) public userVotesForSeminar; // userVotes[roundId][voter] = number of votes
    mapping(uint256 => mapping(address => uint256)) public userVotesForSpeaker; // userVotes[roundId][voter] = number of votes
    mapping(uint256 => mapping(uint256 => uint256)) public totalVotes; // totalVotes[roundId][seminarId] = number of votes

    function getCheckVotedSeminar(
        uint256 roundId,
        uint256 seminarId,
        address voter
    ) public view returns (bool) {
        return votingRounds[roundId].checkVotedSeminar[seminarId][voter];
    }

    function getCheckVotedSpeaker(
        uint256 roundId,
        address speaker,
        address voter
    ) public view returns (bool) {
        return votingRounds[roundId].checkVotedSpeaker[speaker][voter];
    }

    uint256 public nextRoundId;

    event VotingRoundCreated(
        uint256 indexed roundId,
        uint256 startTime,
        uint256 endTime,
        uint256 maxVotesPerVoterForSeminar,
        uint256 maxVotesPerVoterForSpeaker
    );
    event SeminarAddedToRound(
        uint256 indexed roundId,
        uint256 indexed seminarId
    );
    event VotedSeminar(
        uint256 indexed roundId,
        uint256 indexed seminarId,
        address indexed voter
    );
    event RemoveVotedSeminar(
        uint256 indexed roundId,
        uint256 indexed seminarId,
        address indexed voter
    );
    event VotedSpeaker(
        uint256 indexed roundId,
        address indexed speaker,
        address indexed voter
    );
    event RemoveVotedSpeaker(
        uint256 indexed roundId,
        address indexed speaker,
        address indexed voter
    );
    event VotingRoundEnded(uint256 indexed roundId);
    event RoleAdded(address indexed account, bytes32 role);
    event RoleRemoved(address indexed account, bytes32 role);
    event VotingEndTimeChanged(
        uint256 indexed roundId,
        uint256 oldEndTime,
        uint256 newEndTime
    );
    function initialize(
        address admin,
        address seminarNFTAddress,
        address whitelistAddress
    ) public initializer {
        require(admin != address(0), "Invalid admin address");
        require(seminarNFTAddress != address(0), "Invalid seminar NFT address");

        __AccessControl_init();
        seminarNFT = SeminarNFT(seminarNFTAddress);
        whitelist = WhitelistUpgradeableV2(whitelistAddress);
    }

    function hasRole(
        bytes32 role,
        address account
    ) public view override returns (bool) {
        if (super.hasRole(role, account)) {
            return true;
        }
        return whitelist.hasRole(role, account);
    }

    modifier onlyActiveRound(uint256 roundId) {
        require(votingRounds[roundId].isActive, "Voting round is not active");
        require(
            block.timestamp >= votingRounds[roundId].startTime,
            "Voting has not started"
        );
        require(
            block.timestamp <= votingRounds[roundId].endTime,
            "Voting has ended"
        );
        _;
    }

    modifier onlySeminarInRound(uint256 roundId, uint256 seminarId) {
        require(
            votingRounds[roundId].seminarExist[seminarId],
            "Seminar not added to round"
        );
        _;
    }

    // Tạo mới vòng bỏ phiếu
    function createVotingRound(
        uint256 startTime,
        uint256 endTime,
        uint256 maxVotesPerVoterForSeminar,
        uint256 maxVotesPerVoterForSpeaker
    ) public onlyRole(ADMIN_ROLE) {
        require(endTime > startTime, "End time must be after start time");
        require(
            maxVotesPerVoterForSeminar > 0 && maxVotesPerVoterForSpeaker > 0,
            "Max votes per voter must be greater than 0"
        );

        nextRoundId++;
        VotingRound storage newRound = votingRounds[nextRoundId];
        newRound.startTime = startTime;
        newRound.endTime = endTime;
        newRound.maxVotesPerVoterForSeminar = maxVotesPerVoterForSeminar;
        newRound.maxVotesPerVoterForSpeaker = maxVotesPerVoterForSpeaker;
        newRound.isActive = true;

        emit VotingRoundCreated(
            nextRoundId,
            startTime,
            endTime,
            maxVotesPerVoterForSeminar,
            maxVotesPerVoterForSpeaker
        );
    }

    // Thêm seminar vào vòng bỏ phiếu
    function addSeminarToRound(
        uint256 roundId,
        uint256 seminarId
    ) public onlyRole(ADMIN_ROLE) {
        require(votingRounds[roundId].isActive, "Voting round is not active");
        require(
            !votingRounds[roundId].seminarExist[seminarId],
            "Seminar already added to round"
        );

        VotingRound storage round = votingRounds[roundId];
        round.seminarIds.push(seminarId);
        emit SeminarAddedToRound(roundId, seminarId);
        round.seminarExist[seminarId] = true;

        // Thêm speakers vào round
        address[] memory speakers = seminarNFT.getSeminarSpeakers(seminarId);
        uint256 limit = speakers.length;
        for (uint256 i = 0; i < limit; i++) {
            if (!round.speakerExist[speakers[i]]) {
                round.speakersInRound.push(speakers[i]);
                round.speakerExist[speakers[i]] = true;
            }
        }
    }

    // Hàm bỏ phiếu
    function voteForSeminar(
        uint256 roundId,
        uint256 seminarId
    )
        public
        onlyActiveRound(roundId)
        onlySeminarInRound(roundId, seminarId)
        onlyRole(VOTER_ROLE)
    {
        VotingRound storage round = votingRounds[roundId];
        require(
            userVotesForSeminar[roundId][msg.sender] <
                round.maxVotesPerVoterForSeminar,
            "Max votes exceeded"
        );
        require(
            !round.checkVotedSeminar[seminarId][msg.sender],
            "You have already voted for this seminar"
        );
        if (userVotesForSeminar[roundId][msg.sender] == 0) {
            // phiếu đầu thì push phiếu sau không cần
            round.votersForSeminar.push(msg.sender);
        }
        userVotesForSeminar[roundId][msg.sender]++;
        totalVotes[roundId][seminarId]++;
        round.checkVotedSeminar[seminarId][msg.sender] = true;

        emit VotedSeminar(roundId, seminarId, msg.sender);
    }

    // @dev Bỏ phiếu cho speaker
    function voteForSpeaker(
        uint256 roundId,
        address speaker
    ) public onlyActiveRound(roundId) onlyRole(VOTER_ROLE) {
        VotingRound storage round = votingRounds[roundId];
        require(
            userVotesForSpeaker[roundId][msg.sender] <
                round.maxVotesPerVoterForSpeaker,
            "Max votes exceeded"
        );
        require(
            !round.checkVotedSpeaker[speaker][msg.sender],
            "You have already voted for this speaker"
        );
        if (userVotesForSpeaker[roundId][msg.sender] == 0) {
            // tương tự
            round.votersForSpeaker.push(msg.sender);
        }

        userVotesForSpeaker[roundId][msg.sender]++;
        round.speakerVotes[speaker]++;
        round.checkVotedSpeaker[speaker][msg.sender] = true;
        emit VotedSpeaker(roundId, speaker, msg.sender); // sự kiện votedspeaker ở trên
    }

    // Hàm kết thúc vòng bỏ phiếu
    function endVotingRound(uint256 roundId) public onlyRole(ADMIN_ROLE) {
        VotingRound storage round = votingRounds[roundId];
        require(round.isActive, "Voting round is already inactive");
        require(block.timestamp > round.endTime, "Voting period not yet ended");

        round.isActive = false;
        emit VotingRoundEnded(roundId);
    }

    // Add them 1 voter

    // Hàm lấy danh sách người bỏ phiếu cho seminar
    function getSeminarVoters(
        uint256 roundId
    ) public view onlyRole(ADMIN_ROLE) returns (address[] memory) {
        VotingRound storage round = votingRounds[roundId];
        return round.votersForSeminar;
    }

    // Hàm lấy số phiếu của một speaker cụ thể
    function getSpeakerVotes(
        uint256 roundId,
        address speaker
    ) public view onlyRole(ADMIN_ROLE) returns (uint256) {
        VotingRound storage round = votingRounds[roundId];
        return round.speakerVotes[speaker];
    }

    // Hàm lấy người nói có số phiếu cao nhất
    function getWinnerSpeaker(
        uint256 roundId
    ) public view onlyRole(ADMIN_ROLE) returns (address, uint256) {
        return getMaxSpeaker(roundId);
    }

    // Hàm lấy seminar có số phiếu cao nhất
    function getWinnerSeminar(
        uint256 roundId
    ) public view onlyRole(ADMIN_ROLE) returns (uint256, uint256) {
        return getMaxSeminar(roundId);
    }

    // Hàm lấy tất cả speakers và seminars trong một vòng
    function getSpeakersAndSeminars(
        uint256 roundId
    ) public view returns (address[] memory, uint256[] memory) {
        VotingRound storage round = votingRounds[roundId];
        return (round.speakersInRound, round.seminarIds);
    }

    // Hàm nội bộ để lấy speaker có số phiếu cao nhất
    function getMaxSpeaker(
        uint256 roundId
    ) internal view returns (address max, uint256 maxVotes) {
        VotingRound storage round = votingRounds[roundId];
        address[] memory speakers = round.speakersInRound;
        require(speakers.length > 0, "No votes have been cast yet");

        maxVotes = 0;
        max = address(0);
        for (uint256 i = 0; i < speakers.length; i++) {
            if (round.speakerVotes[speakers[i]] > maxVotes) {
                maxVotes = round.speakerVotes[speakers[i]];
                max = speakers[i];
            }
        }
        return (max, maxVotes);
    }

    // Hàm nội bộ để lấy seminar có số phiếu cao nhất
    function getMaxSeminar(
        uint256 roundId
    ) internal view returns (uint256 maxSeminarId, uint256 maxVotes) {
        VotingRound storage round = votingRounds[roundId];
        uint256[] memory seminars = round.seminarIds;
        require(seminars.length > 0, "No votes have been cast yet");

        maxVotes = 0;
        maxSeminarId = 0;
        for (uint256 i = 0; i < seminars.length; i++) {
            if (totalVotes[roundId][seminars[i]] > maxVotes) {
                maxVotes = totalVotes[roundId][seminars[i]];
                maxSeminarId = seminars[i];
            }
        }
        return (maxSeminarId, maxVotes);
    }
    /// @dev Lấy danh sách speaker xếp từ vote cao xuống thấp

    function getResultSpeaker(
        uint256 roundId
    )
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (string[] memory sortedSpeakers, uint256[] memory sortedVotes)
    {
        VotingRound storage round = votingRounds[roundId];
        address[] memory speakers = round.speakersInRound;
        require(speakers.length > 0, "No votes and speaker yet.");
        uint256 speakerCount = speakers.length;
        sortedSpeakers = new string[](speakerCount);
        sortedVotes = new uint256[](speakerCount);
        for (uint256 i = 0; i < speakerCount; i++) {
            sortedSpeakers[i] = whitelist.getName(speakers[i]);
            sortedVotes[i] = round.speakerVotes[speakers[i]];
        }
        for (uint256 i = 0; i < speakerCount; i++) {
            for (uint256 j = i + 1; j < speakerCount; j++) {
                if (sortedVotes[i] < sortedVotes[j]) {
                    uint256 temp = sortedVotes[i];
                    sortedVotes[i] = sortedVotes[j];
                    sortedVotes[j] = temp;
                    string memory tempSpeaker = sortedSpeakers[i];
                    sortedSpeakers[i] = sortedSpeakers[j];
                    sortedSpeakers[j] = tempSpeaker;
                }
            }
        }
        return (sortedSpeakers, sortedVotes);
    }
    function getResultSeminar(
        uint256 roundId
    )
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (
            uint256[] memory sortedSeminarIds,
            uint256[] memory sortedVotes
        )
    {
        VotingRound storage round = votingRounds[roundId];
        uint256[] memory seminars = round.seminarIds;
        require(seminars.length > 0, "No votes and seminar yet.");
        uint256 seminarCount = seminars.length;
        sortedSeminarIds = new uint256[](seminarCount);
        sortedVotes = new uint256[](seminarCount);
        for (uint256 i = 0; i < seminarCount; i++) {
            sortedSeminarIds[i] = seminars[i];
            sortedVotes[i] = totalVotes[roundId][seminars[i]];
        }
        // BUBBLE SORT
        for (uint256 i = 0; i < seminarCount - 1; i++) {
            for (uint256 j = 0; j < seminarCount - i - 1; j++) {
                if (sortedVotes[j] < sortedVotes[j + 1]) {
                    (sortedVotes[j], sortedVotes[j + 1]) = (
                        sortedVotes[j + 1],
                        sortedVotes[j]
                    );
                    (sortedSeminarIds[j], sortedSeminarIds[j + 1]) = (
                        sortedSeminarIds[j + 1],
                        sortedSeminarIds[j]
                    );
                }
            }
        }
        return (sortedSeminarIds, sortedVotes);
    }

    /// @dev change deadline
    function changeVotingEndtime(
        uint256 roundId,
        uint256 newEndTime
    ) public onlyRole(ADMIN_ROLE) {
        VotingRound storage round = votingRounds[roundId];
        require(round.isActive, "Voting round is not active");
        require(
            newEndTime > block.timestamp,
            "New end time must be in the future"
        );
        require(
            newEndTime > round.startTime,
            "New end time must be after start time"
        );
        uint256 oldEndTime = round.endTime;
        round.endTime = newEndTime;
        emit VotingEndTimeChanged(roundId, oldEndTime, newEndTime);
    }

    /// @dev voter xóa voter cho 1 seminar
    function removeVoteForSeminar(
        uint256 roundId,
        uint256 seminarId
    ) public onlyRole(VOTER_ROLE) {
        VotingRound storage round = votingRounds[roundId];
        require(
            round.checkVotedSeminar[seminarId][msg.sender],
            "You have not voted for this seminar"
        );
        if (userVotesForSeminar[roundId][msg.sender] == 1) {
            // nếu chỉ có 1 phiếu thì pop
            for (uint256 i = 0; i < round.votersForSeminar.length; i++) {
                if (round.votersForSeminar[i] == msg.sender) {
                    round.votersForSeminar[i] = round.votersForSeminar[
                        round.votersForSeminar.length - 1
                    ];
                    round.votersForSeminar.pop();
                }
            }
        }
        userVotesForSeminar[roundId][msg.sender]--;
        totalVotes[roundId][seminarId]--;
        round.checkVotedSeminar[seminarId][msg.sender] = false;

        emit RemoveVotedSeminar(roundId, seminarId, msg.sender);
    }

    /// @dev voter xóa voter cho 1 speaker
    function removeVoteForSpeaker(
        uint256 roundId,
        address speaker
    ) public onlyRole(VOTER_ROLE) {
        VotingRound storage round = votingRounds[roundId];
        require(
            round.checkVotedSpeaker[speaker][msg.sender],
            "You have not voted for this speaker"
        );
        if (userVotesForSpeaker[roundId][msg.sender] == 1) {
            // nếu chỉ có 1 phiếu thì pop, hàm pop không gắn được msg sender
            for (uint256 i = 0; i < round.votersForSpeaker.length; i++) {
                if (round.votersForSpeaker[i] == msg.sender) {
                    round.votersForSpeaker[i] = round.votersForSpeaker[
                        round.votersForSpeaker.length - 1
                    ];
                    round.votersForSpeaker.pop();
                }
            }
        }
        userVotesForSpeaker[roundId][msg.sender]--;
        round.speakerVotes[speaker]--;
        round.checkVotedSpeaker[speaker][msg.sender] = false;

        emit RemoveVotedSpeaker(roundId, speaker, msg.sender);
    }

    /// @dev lấy danh sách voter chưa bỏ phiếu cho seminar
    function getVotersDontVoteForSeminar(
        uint256 roundId
    ) public view returns (string[] memory) {
        address[] memory list = whitelist.getVotersList();
        uint256 count = 0;
        for (uint i = 0; i < list.length; ++i) {
            address voter = list[i];
            if (!(userVotesForSeminar[roundId][voter] > 0)) ++count;
        }
        string[] memory votersDontVote = new string[](count);
        for (uint i = 0; i < list.length; ++i) {
            address voter = list[i];
            if (!(userVotesForSeminar[roundId][voter] > 0))
                votersDontVote[--count] = whitelist.getName(voter);
        }
        return votersDontVote;
    }

    /// @dev lấy danh sách voter chưa bỏ phiếu cho speaker
    function getVotersDontVoteForSpeaker(
        uint256 roundId
    ) public view returns (string[] memory) {
        address[] memory list = whitelist.getVotersList();
        uint256 count = 0;
        for (uint i = 0; i < list.length; ++i) {
            address voter = list[i];
            if (!(userVotesForSpeaker[roundId][voter] > 0)) ++count;
        }
        string[] memory votersDontVote = new string[](count);
        for (uint i = 0; i < list.length; ++i) {
            address voter = list[i];
            if (!(userVotesForSpeaker[roundId][voter] > 0))
                votersDontVote[--count] = whitelist.getName(voter);
        }
        return votersDontVote;
    }
}