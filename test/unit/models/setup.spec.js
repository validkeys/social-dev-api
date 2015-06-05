import { 
  BaseFactory as Factory
} from '../../setup';

let lab = Lab.script();

lab.experiment('test', function() {
  lab.test('asdf', (done) => {
    expect(1).to.equal(1);
    done();
  });
});

export { lab };