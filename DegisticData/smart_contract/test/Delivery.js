const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Delivery Contract", function () {
  let Delivery;
  let delivery;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Delivery = await ethers.getContractFactory("delivery");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    delivery = await Delivery.deploy();
    // await delivery.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await delivery.owner()).to.equal(owner.address);
  });

  it("Should create a new station", async function () {
    const stationId = ethers.utils.formatBytes32String("station1");
    const name = ethers.utils.formatBytes32String("Station One");
    const totalOrder = 0;
    const validitors = [addr1.address, addr2.address];

    await delivery.createStation(stationId, name, totalOrder, validitors);

    const station = await delivery.stations(stationId);

    expect(station.station_id).to.equal(stationId);
    expect(station.name).to.equal(name);
    expect(station.total_order).to.equal(totalOrder);
    expect(station.validitors).to.deep.equal(validitors);
  });
});
