import { startServer } from '../../..';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import _ from 'lodash';
import { killAllSimulators } from 'appium-ios-simulator';
import { HOST, PORT } from '../helpers/session';
import { SAFARI_CAPS } from '../desired';
import { spinTitle, GUINEA_PIG_PAGE } from './helpers';


chai.should();
chai.use(chaiAsPromised);

describe('Safari', function () {
  this.timeout(4 * 60 * 1000);

  let server, driver;
  before(async () => {
    await killAllSimulators();

    driver = wd.promiseChainRemote(HOST, PORT);
    server = await startServer(PORT, HOST);
  });

  after(async () => {
    await server.close();
  });

  describe('init', () => {
    afterEach(async function () {
      await driver.quit();
    });

    it('should start a session with default init', async function () {
      await driver.init(SAFARI_CAPS);
      let title = await spinTitle(driver);
      title.should.equal('Appium/welcome');
    });

    it('should start a session with custom init', async function () {
      let caps = _.defaults({
        safariInitialUrl: GUINEA_PIG_PAGE
      }, SAFARI_CAPS);
      await driver.init(caps);
      let title = await spinTitle(driver);
      title.should.equal('I am a page title');
    });
  });

  // TODO: in appium-remote-debugger, figure out how to check if a page is loaded
  describe.skip('page load timeouts', () => {
    before(async () => {
      await driver.init(SAFARI_CAPS);
    });

    describe('small timeout, slow page load', function () {
      it('should go to the requested page', async () => {
        await driver.setPageLoadTimeout(5000);
        await driver.get(`${GUINEA_PIG_PAGE}?delay=30000`);

        // the page should not have time to load
        (await driver.source()).should.include('Let\'s browse!');
      });
    });
    describe('no timeout, very slow page', function () {
      let startMs = Date.now();

      it('should go to the requested page', async () => {
        await driver.setCommandTimeout(120000);
        await driver.setPageLoadTimeout(0);
        await driver.get(`${GUINEA_PIG_PAGE}?delay=30000`);

        // the page should load after 70000
        (await driver.source()).should.include('I am some page content');
        (Date.now() - startMs).should.be.above(30000);
      });
    });
  });
});
