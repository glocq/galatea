(() => {
  // output/Control.Bind/foreign.js
  var arrayBind = function(arr) {
    return function(f) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        Array.prototype.push.apply(result, f(arr[i]));
      }
      return result;
    };
  };

  // output/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i = 0; i < l; i++) {
        var f = fs[i];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }
  };
  var compose = function(dict) {
    return dict.compose;
  };
  var composeFlipped = function(dictSemigroupoid) {
    var compose1 = compose(dictSemigroupoid);
    return function(f) {
      return function(g) {
        return compose1(g)(f);
      };
    };
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var flip = function(f) {
    return function(b) {
      return function(a) {
        return f(a)(b);
      };
    };
  };
  var $$const = function(a) {
    return function(v) {
      return a;
    };
  };
  var applyFlipped = function(x) {
    return function(f) {
      return f(x);
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ function() {
    function $$Proxy2() {
    }
    ;
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  }();

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var mapFlipped = function(dictFunctor) {
    var map110 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map110(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var voidLeft = function(dictFunctor) {
    var map110 = map(dictFunctor);
    return function(f) {
      return function(x) {
        return map110($$const(x))(f);
      };
    };
  };
  var voidRight = function(dictFunctor) {
    var map110 = map(dictFunctor);
    return function(x) {
      return map110($$const(x));
    };
  };
  var functorFn = {
    map: /* @__PURE__ */ compose(semigroupoidFn)
  };
  var functorArray = {
    map: arrayMap
  };
  var flap = function(dictFunctor) {
    var map110 = map(dictFunctor);
    return function(ff2) {
      return function(x) {
        return map110(function(f) {
          return f(x);
        })(ff2);
      };
    };
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyFn = {
    apply: function(f) {
      return function(g) {
        return function(x) {
          return f(x)(g(x));
        };
      };
    },
    Functor0: function() {
      return functorFn;
    }
  };
  var applyArray = {
    apply: arrayApply,
    Functor0: function() {
      return functorArray;
    }
  };
  var apply = function(dict) {
    return dict.apply;
  };
  var applySecond = function(dictApply) {
    var apply1 = apply(dictApply);
    var map29 = map(dictApply.Functor0());
    return function(a) {
      return function(b) {
        return apply1(map29($$const(identity2))(a))(b);
      };
    };
  };
  var lift2 = function(dictApply) {
    var apply1 = apply(dictApply);
    var map29 = map(dictApply.Functor0());
    return function(f) {
      return function(a) {
        return function(b) {
          return apply1(map29(f)(a))(b);
        };
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var when = function(dictApplicative) {
    var pure15 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure15(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply7 = apply(dictApplicative.Apply0());
    var pure15 = pure(dictApplicative);
    return function(f) {
      return function(a) {
        return apply7(pure15(f))(a);
      };
    };
  };
  var applicativeFn = {
    pure: function(x) {
      return function(v) {
        return x;
      };
    },
    Apply0: function() {
      return applyFn;
    }
  };

  // output/Control.Bind/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var discard = function(dict) {
    return dict.discard;
  };
  var bindArray = {
    bind: arrayBind,
    Apply0: function() {
      return applyArray;
    }
  };
  var bind = function(dict) {
    return dict.bind;
  };
  var bindFlipped = function(dictBind) {
    return flip(bind(dictBind));
  };
  var composeKleisli = function(dictBind) {
    var bind1 = bind(dictBind);
    return function(f) {
      return function(g) {
        return function(a) {
          return bind1(f(a))(g);
        };
      };
    };
  };
  var discardUnit = {
    discard: function(dictBind) {
      return bind(dictBind);
    }
  };
  var join = function(dictBind) {
    var bind1 = bind(dictBind);
    return function(m) {
      return bind1(m)(identity3);
    };
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce = function(x) {
    return x;
  };

  // output/Control.Monad.ST.Global/index.js
  var toEffect = unsafeCoerce;

  // output/Control.Monad.ST.Internal/foreign.js
  var map_ = function(f) {
    return function(a) {
      return function() {
        return f(a());
      };
    };
  };
  var pure_ = function(a) {
    return function() {
      return a;
    };
  };
  var bind_ = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };
  var foreach = function(as) {
    return function(f) {
      return function() {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };
  function newSTRef(val) {
    return function() {
      return { value: val };
    };
  }
  var read = function(ref) {
    return function() {
      return ref.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref) {
      return function() {
        var t = f(ref.value);
        ref.value = t.state;
        return t.value;
      };
    };
  };
  var write = function(a) {
    return function(ref) {
      return function() {
        return ref.value = a;
      };
    };
  };

  // output/Control.Monad/index.js
  var ap = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    var pure15 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a) {
        return bind9(f)(function(f$prime) {
          return bind9(a)(function(a$prime) {
            return pure15(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Data.Semigroup/foreign.js
  var concatString = function(s1) {
    return function(s2) {
      return s1 + s2;
    };
  };
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function(dict) {
    return dict.reflectSymbol;
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label4) {
    return function(rec) {
      return rec[label4];
    };
  };
  var unsafeSet = function(label4) {
    return function(value15) {
      return function(rec) {
        var copy = {};
        for (var key5 in rec) {
          if ({}.hasOwnProperty.call(rec, key5)) {
            copy[key5] = rec[key5];
          }
        }
        copy[label4] = value15;
        return copy;
      };
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupUnit = {
    append: function(v) {
      return function(v1) {
        return unit;
      };
    }
  };
  var semigroupString = {
    append: concatString
  };
  var semigroupRecordNil = {
    appendRecord: function(v) {
      return function(v1) {
        return function(v2) {
          return {};
        };
      };
    }
  };
  var semigroupArray = {
    append: concatArray
  };
  var appendRecord = function(dict) {
    return dict.appendRecord;
  };
  var semigroupRecord = function() {
    return function(dictSemigroupRecord) {
      return {
        append: appendRecord(dictSemigroupRecord)($$Proxy.value)
      };
    };
  };
  var append = function(dict) {
    return dict.append;
  };
  var semigroupFn = function(dictSemigroup) {
    var append14 = append(dictSemigroup);
    return {
      append: function(f) {
        return function(g) {
          return function(x) {
            return append14(f(x))(g(x));
          };
        };
      }
    };
  };
  var semigroupRecordCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(dictSemigroupRecord) {
        var appendRecord1 = appendRecord(dictSemigroupRecord);
        return function(dictSemigroup) {
          var append14 = append(dictSemigroup);
          return {
            appendRecord: function(v) {
              return function(ra) {
                return function(rb) {
                  var tail2 = appendRecord1($$Proxy.value)(ra)(rb);
                  var key5 = reflectSymbol2($$Proxy.value);
                  var insert5 = unsafeSet(key5);
                  var get2 = unsafeGet(key5);
                  return insert5(append14(get2(ra))(get2(rb)))(tail2);
                };
              };
            }
          };
        };
      };
    };
  };

  // output/Control.Alt/index.js
  var alt = function(dict) {
    return dict.alt;
  };

  // output/Data.Bounded/foreign.js
  var topInt = 2147483647;
  var bottomInt = -2147483648;
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq5) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq5 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordNumberImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqNumberImpl = refEq;
  var eqCharImpl = refEq;
  var eqStringImpl = refEq;

  // output/Data.Eq/index.js
  var eqString = {
    eq: eqStringImpl
  };
  var eqNumber = {
    eq: eqNumberImpl
  };
  var eqInt = {
    eq: eqIntImpl
  };
  var eqChar = {
    eq: eqCharImpl
  };
  var eq1 = function(dict) {
    return dict.eq1;
  };
  var eq = function(dict) {
    return dict.eq;
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();

  // output/Data.Ring/foreign.js
  var intSub = function(x) {
    return function(y) {
      return x - y | 0;
    };
  };

  // output/Data.Semiring/foreign.js
  var intAdd = function(x) {
    return function(y) {
      return x + y | 0;
    };
  };
  var intMul = function(x) {
    return function(y) {
      return x * y | 0;
    };
  };

  // output/Data.Semiring/index.js
  var semiringInt = {
    add: intAdd,
    zero: 0,
    mul: intMul,
    one: 1
  };
  var add = function(dict) {
    return dict.add;
  };

  // output/Data.Ring/index.js
  var ringInt = {
    sub: intSub,
    Semiring0: function() {
      return semiringInt;
    }
  };

  // output/Data.Ord/index.js
  var ordNumber = /* @__PURE__ */ function() {
    return {
      compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqNumber;
      }
    };
  }();
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var ordChar = /* @__PURE__ */ function() {
    return {
      compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqChar;
      }
    };
  }();
  var compare1 = function(dict) {
    return dict.compare1;
  };
  var compare = function(dict) {
    return dict.compare;
  };
  var greaterThan = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare3(a1)(a2);
        if (v instanceof GT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var lessThan = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare3(a1)(a2);
        if (v instanceof LT) {
          return true;
        }
        ;
        return false;
      };
    };
  };
  var lessThanOrEq = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare3(a1)(a2);
        if (v instanceof GT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var max = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return y;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return x;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
      };
    };
  };
  var min = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return x;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return y;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v.constructor.name]);
      };
    };
  };
  var clamp = function(dictOrd) {
    var min1 = min(dictOrd);
    var max1 = max(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x) {
          return min1(hi)(max1(low2)(x));
        };
      };
    };
  };

  // output/Data.Bounded/index.js
  var top = function(dict) {
    return dict.top;
  };
  var boundedInt = {
    top: topInt,
    bottom: bottomInt,
    Ord0: function() {
      return ordInt;
    }
  };
  var boundedChar = {
    top: topChar,
    bottom: bottomChar,
    Ord0: function() {
      return ordChar;
    }
  };
  var bottom = function(dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showNumberImpl = function(n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };

  // output/Data.Show/index.js
  var showNumber = {
    show: showNumberImpl
  };
  var showInt = {
    show: showIntImpl
  };
  var show = function(dict) {
    return dict.show;
  };

  // output/Data.Maybe/index.js
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a) {
    return maybe(a)(identity4);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };
  var applicativeMaybe = /* @__PURE__ */ function() {
    return {
      pure: Just.create,
      Apply0: function() {
        return applyMaybe;
      }
    };
  }();
  var altMaybe = {
    alt: function(v) {
      return function(v1) {
        if (v instanceof Nothing) {
          return v1;
        }
        ;
        return v;
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var plusMaybe = /* @__PURE__ */ function() {
    return {
      empty: Nothing.value,
      Alt0: function() {
        return altMaybe;
      }
    };
  }();

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left2(value0) {
      this.value0 = value0;
    }
    ;
    Left2.create = function(value0) {
      return new Left2(value0);
    };
    return Left2;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right2(value0) {
      this.value0 = value0;
    }
    ;
    Right2.create = function(value0) {
      return new Right2(value0);
    };
    return Right2;
  }();
  var functorEither = {
    map: function(f) {
      return function(m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        ;
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var either = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var hush = /* @__PURE__ */ function() {
    return either($$const(Nothing.value))(Just.create);
  }();

  // output/Data.Identity/index.js
  var Identity = function(x) {
    return x;
  };
  var functorIdentity = {
    map: function(f) {
      return function(m) {
        return f(m);
      };
    }
  };
  var applyIdentity = {
    apply: function(v) {
      return function(v1) {
        return v(v1);
      };
    },
    Functor0: function() {
      return functorIdentity;
    }
  };
  var bindIdentity = {
    bind: function(v) {
      return function(f) {
        return f(v);
      };
    },
    Apply0: function() {
      return applyIdentity;
    }
  };
  var applicativeIdentity = {
    pure: Identity,
    Apply0: function() {
      return applyIdentity;
    }
  };
  var monadIdentity = {
    Applicative0: function() {
      return applicativeIdentity;
    },
    Bind1: function() {
      return bindIdentity;
    }
  };

  // output/Data.EuclideanRing/foreign.js
  var intDegree = function(x) {
    return Math.min(Math.abs(x), 2147483647);
  };
  var intDiv = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
    };
  };
  var intMod = function(x) {
    return function(y) {
      if (y === 0)
        return 0;
      var yy = Math.abs(y);
      return (x % yy + yy) % yy;
    };
  };

  // output/Data.CommutativeRing/index.js
  var commutativeRingInt = {
    Ring0: function() {
      return ringInt;
    }
  };

  // output/Data.EuclideanRing/index.js
  var mod = function(dict) {
    return dict.mod;
  };
  var euclideanRingInt = {
    degree: intDegree,
    div: intDiv,
    mod: intMod,
    CommutativeRing0: function() {
      return commutativeRingInt;
    }
  };

  // output/Data.Monoid/index.js
  var semigroupRecord2 = /* @__PURE__ */ semigroupRecord();
  var monoidUnit = {
    mempty: unit,
    Semigroup0: function() {
      return semigroupUnit;
    }
  };
  var monoidRecordNil = {
    memptyRecord: function(v) {
      return {};
    },
    SemigroupRecord0: function() {
      return semigroupRecordNil;
    }
  };
  var monoidArray = {
    mempty: [],
    Semigroup0: function() {
      return semigroupArray;
    }
  };
  var memptyRecord = function(dict) {
    return dict.memptyRecord;
  };
  var monoidRecord = function() {
    return function(dictMonoidRecord) {
      var semigroupRecord1 = semigroupRecord2(dictMonoidRecord.SemigroupRecord0());
      return {
        mempty: memptyRecord(dictMonoidRecord)($$Proxy.value),
        Semigroup0: function() {
          return semigroupRecord1;
        }
      };
    };
  };
  var mempty = function(dict) {
    return dict.mempty;
  };
  var monoidFn = function(dictMonoid) {
    var mempty12 = mempty(dictMonoid);
    var semigroupFn2 = semigroupFn(dictMonoid.Semigroup0());
    return {
      mempty: function(v) {
        return mempty12;
      },
      Semigroup0: function() {
        return semigroupFn2;
      }
    };
  };
  var monoidRecordCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    var semigroupRecordCons2 = semigroupRecordCons(dictIsSymbol)();
    return function(dictMonoid) {
      var mempty12 = mempty(dictMonoid);
      var Semigroup0 = dictMonoid.Semigroup0();
      return function() {
        return function(dictMonoidRecord) {
          var memptyRecord1 = memptyRecord(dictMonoidRecord);
          var semigroupRecordCons1 = semigroupRecordCons2(dictMonoidRecord.SemigroupRecord0())(Semigroup0);
          return {
            memptyRecord: function(v) {
              var tail2 = memptyRecord1($$Proxy.value);
              var key5 = reflectSymbol2($$Proxy.value);
              var insert5 = unsafeSet(key5);
              return insert5(mempty12)(tail2);
            },
            SemigroupRecord0: function() {
              return semigroupRecordCons1;
            }
          };
        };
      };
    };
  };

  // output/Effect/foreign.js
  var pureE = function(a) {
    return function() {
      return a;
    };
  };
  var bindE = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };
  var foreachE = function(as) {
    return function(f) {
      return function() {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name15, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name15 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
  var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);
  var lift22 = /* @__PURE__ */ lift2(applyEffect);
  var semigroupEffect = function(dictSemigroup) {
    return {
      append: lift22(append(dictSemigroup))
    };
  };
  var monoidEffect = function(dictMonoid) {
    var semigroupEffect1 = semigroupEffect(dictMonoid.Semigroup0());
    return {
      mempty: pureE(mempty(dictMonoid)),
      Semigroup0: function() {
        return semigroupEffect1;
      }
    };
  };

  // output/Control.Monad.ST.Internal/index.js
  var $runtime_lazy2 = function(name15, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name15 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var functorST = {
    map: map_
  };
  var monadST = {
    Applicative0: function() {
      return applicativeST;
    },
    Bind1: function() {
      return bindST;
    }
  };
  var bindST = {
    bind: bind_,
    Apply0: function() {
      return $lazy_applyST(0);
    }
  };
  var applicativeST = {
    pure: pure_,
    Apply0: function() {
      return $lazy_applyST(0);
    }
  };
  var $lazy_applyST = /* @__PURE__ */ $runtime_lazy2("applyST", "Control.Monad.ST.Internal", function() {
    return {
      apply: ap(monadST),
      Functor0: function() {
        return functorST;
      }
    };
  });
  var applyST = /* @__PURE__ */ $lazy_applyST(47);
  var lift23 = /* @__PURE__ */ lift2(applyST);
  var pure2 = /* @__PURE__ */ pure(applicativeST);
  var semigroupST = function(dictSemigroup) {
    return {
      append: lift23(append(dictSemigroup))
    };
  };
  var monoidST = function(dictMonoid) {
    var semigroupST1 = semigroupST(dictMonoid.Semigroup0());
    return {
      mempty: pure2(mempty(dictMonoid)),
      Semigroup0: function() {
        return semigroupST1;
      }
    };
  };

  // output/Control.Monad.ST.Class/index.js
  var monadSTST = {
    liftST: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadST;
    }
  };
  var monadSTEffect = {
    liftST: toEffect,
    Monad0: function() {
      return monadEffect;
    }
  };
  var liftST = function(dict) {
    return dict.liftST;
  };

  // output/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b) {
    return !b;
  };

  // output/Data.HeytingAlgebra/index.js
  var not = function(dict) {
    return dict.not;
  };
  var ff = function(dict) {
    return dict.ff;
  };
  var disj = function(dict) {
    return dict.disj;
  };
  var heytingAlgebraBoolean = {
    ff: false,
    tt: true,
    implies: function(a) {
      return function(b) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
    },
    conj: boolConj,
    disj: boolDisj,
    not: boolNot
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var snd = function(v) {
    return v.value1;
  };
  var functorTuple = {
    map: function(f) {
      return function(m) {
        return new Tuple(m.value0, f(m.value1));
      };
    }
  };
  var fst = function(v) {
    return v.value0;
  };

  // output/FRP.Event/foreign.js
  var fastForeachThunk = (as) => {
    for (var i = 0, l = as.length; i < l; i++) {
      as[i]();
    }
  };
  var fastForeachE = (as, f) => {
    for (var i = 0, l = as.length; i < l; i++) {
      f(as[i]);
    }
  };
  var objHack = () => {
    return { r: false, q: [], m: [{}] };
  };
  var insertObjHack = (k, v, o) => {
    o.m[o.m.length - 1][k] = v;
  };
  var deleteObjHack = (k, o) => {
    for (const m of o.m) {
      if (delete m[k]) {
        return true;
      }
    }
    return false;
  };
  var fastForeachOhE = (o, f) => {
    if (o.r) {
      o.q.push(() => {
        fastForeachOhE(o, f);
      });
      return;
    }
    o.r = true;
    const M = {};
    const run3 = (i) => {
      o.m.push({});
      for (const kv of Object.entries(o.m[i])) {
        const k = kv[0];
        const v = kv[1];
        f(v);
        if (Object.keys(o.m[i + 1]).length)
          run3(i + 1);
        o.m[i + 1] = {};
        o.m.length = i + 1 + 1;
        M[k] = v;
      }
    };
    run3(0);
    o.m.length = 0;
    o.m.push(M);
    let fn;
    o.r = false;
    while (fn = o.q.shift()) {
      fn();
    }
  };

  // output/Data.Array/foreign.js
  var rangeImpl = function(start2, end) {
    var step2 = start2 > end ? -1 : 1;
    var result = new Array(step2 * (end - start2) + 1);
    var i = start2, n = 0;
    while (i !== end) {
      result[n++] = i;
      i += step2;
    }
    result[n] = i;
    return result;
  };
  var replicateFill = function(count2, value15) {
    if (count2 < 1) {
      return [];
    }
    var result = new Array(count2);
    return result.fill(value15);
  };
  var replicatePolyfill = function(count2, value15) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count2; i++) {
      result[n++] = value15;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = /* @__PURE__ */ function() {
    function Cons2(head2, tail2) {
      this.head = head2;
      this.tail = tail2;
    }
    var emptyList = {};
    function curryCons(head2) {
      return function(tail2) {
        return new Cons2(head2, tail2);
      };
    }
    function listToArray(list) {
      var result = [];
      var count2 = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count2++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr5, xs) {
      return listToArray(foldr5(curryCons)(emptyList)(xs));
    };
  }();
  var length = function(xs) {
    return xs.length;
  };
  var indexImpl = function(just, nothing, xs, i) {
    return i < 0 || i >= xs.length ? nothing : just(xs[i]);
  };
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (f(xs[i]))
        return just(i);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i, l) {
    if (i < 0 || i >= l.length)
      return nothing;
    var l1 = l.slice();
    l1.splice(i, 1);
    return just(l1);
  };
  var filterImpl = function(f, xs) {
    return xs.filter(f);
  };
  var partitionImpl = function(f, xs) {
    var yes = [];
    var no = [];
    for (var i = 0; i < xs.length; i++) {
      var x = xs[i];
      if (f(x))
        yes.push(x);
      else
        no.push(x);
    }
    return { yes, no };
  };

  // output/Data.Array.ST/foreign.js
  function newSTArray() {
    return [];
  }
  function unsafeFreezeThawImpl(xs) {
    return xs;
  }
  var unsafeFreezeImpl = unsafeFreezeThawImpl;
  function copyImpl(xs) {
    return xs.slice();
  }
  var freezeImpl = copyImpl;
  var thawImpl = copyImpl;
  var pushImpl = function(a, xs) {
    return xs.push(a);
  };

  // output/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn1 = function runSTFn12(fn) {
    return function(a) {
      return function() {
        return fn(a);
      };
    };
  };
  var runSTFn2 = function runSTFn22(fn) {
    return function(a) {
      return function(b) {
        return function() {
          return fn(a, b);
        };
      };
    };
  };

  // output/Data.Array.ST/index.js
  var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
  var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
  var withArray = function(f) {
    return function(xs) {
      return function __do5() {
        var result = thaw(xs)();
        f(result)();
        return unsafeFreeze(result)();
      };
    };
  };
  var push = /* @__PURE__ */ runSTFn2(pushImpl);
  var freeze = /* @__PURE__ */ runSTFn1(freezeImpl);

  // output/Data.Array.ST.Iterator/index.js
  var map3 = /* @__PURE__ */ map(functorST);
  var not2 = /* @__PURE__ */ not(heytingAlgebraBoolean);
  var $$void2 = /* @__PURE__ */ $$void(functorST);
  var Iterator = /* @__PURE__ */ function() {
    function Iterator2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Iterator2.create = function(value0) {
      return function(value1) {
        return new Iterator2(value0, value1);
      };
    };
    return Iterator2;
  }();
  var next = function(v) {
    return function __do5() {
      var i = read(v.value1)();
      modify(function(v1) {
        return v1 + 1 | 0;
      })(v.value1)();
      return v.value0(i);
    };
  };
  var iterator = function(f) {
    return map3(Iterator.create(f))(newSTRef(0));
  };
  var iterate = function(iter) {
    return function(f) {
      return function __do5() {
        var $$break = newSTRef(false)();
        while (map3(not2)(read($$break))()) {
          (function __do6() {
            var mx = next(iter)();
            if (mx instanceof Just) {
              return f(mx.value0)();
            }
            ;
            if (mx instanceof Nothing) {
              return $$void2(write(true)($$break))();
            }
            ;
            throw new Error("Failed pattern match at Data.Array.ST.Iterator (line 42, column 5 - line 44, column 47): " + [mx.constructor.name]);
          })();
        }
        ;
        return {};
      };
    };
  };

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };

  // output/Control.Plus/index.js
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Data.Maybe.First/index.js
  var semigroupFirst = {
    append: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v;
        }
        ;
        return v1;
      };
    }
  };
  var monoidFirst = /* @__PURE__ */ function() {
    return {
      mempty: Nothing.value,
      Semigroup0: function() {
        return semigroupFirst;
      }
    };
  }();

  // output/Data.Monoid.Disj/index.js
  var Disj = function(x) {
    return x;
  };
  var semigroupDisj = function(dictHeytingAlgebra) {
    var disj2 = disj(dictHeytingAlgebra);
    return {
      append: function(v) {
        return function(v1) {
          return disj2(v)(v1);
        };
      }
    };
  };
  var monoidDisj = function(dictHeytingAlgebra) {
    var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
    return {
      mempty: ff(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupDisj1;
      }
    };
  };

  // output/Data.Monoid.Endo/index.js
  var semigroupEndo = function(dictSemigroupoid) {
    var compose2 = compose(dictSemigroupoid);
    return {
      append: function(v) {
        return function(v1) {
          return compose2(v)(v1);
        };
      }
    };
  };
  var monoidEndo = function(dictCategory) {
    var semigroupEndo1 = semigroupEndo(dictCategory.Semigroupoid0());
    return {
      mempty: identity(dictCategory),
      Semigroup0: function() {
        return semigroupEndo1;
      }
    };
  };

  // output/Safe.Coerce/index.js
  var coerce = function() {
    return unsafeCoerce;
  };

  // output/Data.Newtype/index.js
  var coerce2 = /* @__PURE__ */ coerce();
  var unwrap = function() {
    return coerce2;
  };
  var alaF = function() {
    return function() {
      return function() {
        return function() {
          return function(v) {
            return coerce2;
          };
        };
      };
    };
  };

  // output/Data.Foldable/index.js
  var unwrap2 = /* @__PURE__ */ unwrap();
  var alaF2 = /* @__PURE__ */ alaF()()()();
  var foldr = function(dict) {
    return dict.foldr;
  };
  var oneOf = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictPlus) {
      return foldr22(alt(dictPlus.Alt0()))(empty(dictPlus));
    };
  };
  var traverse_ = function(dictApplicative) {
    var applySecond4 = applySecond(dictApplicative.Apply0());
    var pure15 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(f) {
        return foldr22(function($454) {
          return applySecond4(f($454));
        })(pure15(unit));
      };
    };
  };
  var for_ = function(dictApplicative) {
    var traverse_1 = traverse_(dictApplicative);
    return function(dictFoldable) {
      return flip(traverse_1(dictFoldable));
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var foldableMaybe = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty6 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return mempty6;
          }
          ;
          if (v1 instanceof Just) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append9 = append(dictMonoid.Semigroup0());
      var mempty6 = mempty(dictMonoid);
      return function(f) {
        return foldr22(function(x) {
          return function(acc) {
            return append9(f(x))(acc);
          };
        })(mempty6);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function(dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    }
  };
  var foldMap = function(dict) {
    return dict.foldMap;
  };
  var lookup = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable)(monoidFirst);
    return function(dictEq) {
      var eq22 = eq(dictEq);
      return function(a) {
        var $460 = foldMap22(function(v) {
          var $444 = eq22(a)(v.value0);
          if ($444) {
            return new Just(v.value1);
          }
          ;
          return Nothing.value;
        });
        return function($461) {
          return unwrap2($460($461));
        };
      };
    };
  };
  var any = function(dictFoldable) {
    var foldMap22 = foldMap(dictFoldable);
    return function(dictHeytingAlgebra) {
      return alaF2(Disj)(foldMap22(monoidDisj(dictHeytingAlgebra)));
    };
  };
  var elem = function(dictFoldable) {
    var any1 = any(dictFoldable)(heytingAlgebraBoolean);
    return function(dictEq) {
      var $462 = eq(dictEq);
      return function($463) {
        return any1($462($463));
      };
    };
  };

  // output/Data.Function.Uncurried/foreign.js
  var runFn2 = function(fn) {
    return function(a) {
      return function(b) {
        return fn(a, b);
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex = function(dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function() {
      return functorArray;
    }
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust5) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value15 = b;
              while (true) {
                var maybe2 = f(value15);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust5(maybe2);
                result.push(fst2(tuple));
                value15 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust5) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value15 = b;
              while (true) {
                var tuple = f(value15);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value15 = fromJust5(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function(dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function() {
      return unfoldable1Array;
    }
  };

  // output/Data.Array/index.js
  var fromJust4 = /* @__PURE__ */ fromJust();
  var append2 = /* @__PURE__ */ append(semigroupArray);
  var snoc = function(xs) {
    return function(x) {
      return withArray(push(x))(xs)();
    };
  };
  var singleton2 = function(a) {
    return [a];
  };
  var range2 = /* @__PURE__ */ runFn2(rangeImpl);
  var partition = /* @__PURE__ */ runFn2(partitionImpl);
  var index = /* @__PURE__ */ function() {
    return runFn4(indexImpl)(Just.create)(Nothing.value);
  }();
  var fromFoldable = function(dictFoldable) {
    return runFn2(fromFoldableImpl)(foldr(dictFoldable));
  };
  var findIndex = /* @__PURE__ */ function() {
    return runFn4(findIndexImpl)(Just.create)(Nothing.value);
  }();
  var filter = /* @__PURE__ */ runFn2(filterImpl);
  var deleteAt = /* @__PURE__ */ function() {
    return runFn4(_deleteAt)(Just.create)(Nothing.value);
  }();
  var deleteBy = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2.length === 0) {
          return [];
        }
        ;
        return maybe(v2)(function(i) {
          return fromJust4(deleteAt(i)(v2));
        })(findIndex(v(v1))(v2));
      };
    };
  };
  var cons = function(x) {
    return function(xs) {
      return append2([x])(xs);
    };
  };
  var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
  var mapMaybe = function(f) {
    return concatMap(function() {
      var $189 = maybe([])(singleton2);
      return function($190) {
        return $189(f($190));
      };
    }());
  };

  // output/Data.NonEmpty/index.js
  var NonEmpty = /* @__PURE__ */ function() {
    function NonEmpty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NonEmpty2.create = function(value0) {
      return function(value1) {
        return new NonEmpty2(value0, value1);
      };
    };
    return NonEmpty2;
  }();
  var singleton3 = function(dictPlus) {
    var empty9 = empty(dictPlus);
    return function(a) {
      return new NonEmpty(a, empty9);
    };
  };

  // output/Data.List.Types/index.js
  var Nil = /* @__PURE__ */ function() {
    function Nil2() {
    }
    ;
    Nil2.value = new Nil2();
    return Nil2;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons2.create = function(value0) {
      return function(value1) {
        return new Cons2(value0, value1);
      };
    };
    return Cons2;
  }();
  var NonEmptyList = function(x) {
    return x;
  };
  var toList = function(v) {
    return new Cons(v.value0, v.value1);
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
            $tco_var_v = new Cons(v1, v);
            $copy_v1 = v1.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v2) {
            if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
              return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
            }
            ;
            if (v2 instanceof Cons && v2.value1 instanceof Nil) {
              return new Cons(f(v2.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v2) {
            return function($copy_v3) {
              var $tco_var_v2 = $copy_v2;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v2, v3) {
                if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v2 = v2.value1;
                  $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                  return;
                }
                ;
                $tco_done1 = true;
                return v3;
              }
              ;
              while (!$tco_done1) {
                $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
              }
              ;
              return $tco_result2;
            };
          };
          $tco_done = true;
          return reverseUnrolledMap(v)(unrolledMap(v1));
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return chunkedRevMap(Nil.value);
  };
  var functorList = {
    map: listMap
  };
  var map4 = /* @__PURE__ */ map(functorList);
  var foldableList = {
    foldr: function(f) {
      return function(b) {
        var rev3 = function() {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1) {
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return v;
                }
                ;
                if (v1 instanceof Cons) {
                  $tco_var_v = new Cons(v1.value0, v);
                  $copy_v1 = v1.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(Nil.value);
        }();
        var $284 = foldl(foldableList)(flip(f))(b);
        return function($285) {
          return $284(rev3($285));
        };
      };
    },
    foldl: function(f) {
      var go2 = function($copy_b) {
        return function($copy_v) {
          var $tco_var_b = $copy_b;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(b, v) {
            if (v instanceof Nil) {
              $tco_done1 = true;
              return b;
            }
            ;
            if (v instanceof Cons) {
              $tco_var_b = f(b)(v.value0);
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_b, $copy_v);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append25 = append(dictMonoid.Semigroup0());
      var mempty6 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $286 = append25(acc);
          return function($287) {
            return $286(f($287));
          };
        })(mempty6);
      };
    }
  };
  var foldr2 = /* @__PURE__ */ foldr(foldableList);
  var semigroupList = {
    append: function(xs) {
      return function(ys) {
        return foldr2(Cons.create)(ys)(xs);
      };
    }
  };
  var append1 = /* @__PURE__ */ append(semigroupList);
  var semigroupNonEmptyList = {
    append: function(v) {
      return function(as$prime) {
        return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
      };
    }
  };
  var eq1List = {
    eq1: function(dictEq) {
      var eq5 = eq(dictEq);
      return function(xs) {
        return function(ys) {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              return function($copy_v2) {
                var $tco_var_v = $copy_v;
                var $tco_var_v1 = $copy_v1;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(v, v1, v2) {
                  if (!v2) {
                    $tco_done = true;
                    return false;
                  }
                  ;
                  if (v instanceof Nil && v1 instanceof Nil) {
                    $tco_done = true;
                    return v2;
                  }
                  ;
                  if (v instanceof Cons && v1 instanceof Cons) {
                    $tco_var_v = v.value1;
                    $tco_var_v1 = v1.value1;
                    $copy_v2 = v2 && eq5(v1.value0)(v.value0);
                    return;
                  }
                  ;
                  $tco_done = true;
                  return false;
                }
                ;
                while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
                }
                ;
                return $tco_result;
              };
            };
          };
          return go2(xs)(ys)(true);
        };
      };
    }
  };
  var eq12 = /* @__PURE__ */ eq1(eq1List);
  var eqList = function(dictEq) {
    return {
      eq: eq12(dictEq)
    };
  };
  var ord1List = {
    compare1: function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(xs) {
        return function(ys) {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1) {
                if (v instanceof Nil && v1 instanceof Nil) {
                  $tco_done = true;
                  return EQ.value;
                }
                ;
                if (v instanceof Nil) {
                  $tco_done = true;
                  return LT.value;
                }
                ;
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return GT.value;
                }
                ;
                if (v instanceof Cons && v1 instanceof Cons) {
                  var v2 = compare2(v.value0)(v1.value0);
                  if (v2 instanceof EQ) {
                    $tco_var_v = v.value1;
                    $copy_v1 = v1.value1;
                    return;
                  }
                  ;
                  $tco_done = true;
                  return v2;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 60, column 5 - line 60, column 20): " + [v.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(xs)(ys);
        };
      };
    },
    Eq10: function() {
      return eq1List;
    }
  };
  var compare12 = /* @__PURE__ */ compare1(ord1List);
  var ordList = function(dictOrd) {
    var eqList1 = eqList(dictOrd.Eq0());
    return {
      compare: compare12(dictOrd),
      Eq0: function() {
        return eqList1;
      }
    };
  };
  var applyList = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v instanceof Cons) {
          return append1(map4(v.value0)(v1))(apply(applyList)(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorList;
    }
  };
  var applicativeList = {
    pure: function(a) {
      return new Cons(a, Nil.value);
    },
    Apply0: function() {
      return applyList;
    }
  };
  var altList = {
    alt: append1,
    Functor0: function() {
      return functorList;
    }
  };
  var plusList = /* @__PURE__ */ function() {
    return {
      empty: Nil.value,
      Alt0: function() {
        return altList;
      }
    };
  }();

  // output/Data.List/index.js
  var foldr3 = /* @__PURE__ */ foldr(foldableList);
  var snoc2 = function(xs) {
    return function(x) {
      return foldr3(Cons.create)(new Cons(x, Nil.value))(xs);
    };
  };

  // output/Data.Map.Internal/index.js
  var $runtime_lazy3 = function(name15, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name15 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var Leaf = /* @__PURE__ */ function() {
    function Leaf2() {
    }
    ;
    Leaf2.value = new Leaf2();
    return Leaf2;
  }();
  var Node = /* @__PURE__ */ function() {
    function Node2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    Node2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new Node2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return Node2;
  }();
  var Split = /* @__PURE__ */ function() {
    function Split2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Split2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Split2(value0, value1, value22);
        };
      };
    };
    return Split2;
  }();
  var SplitLast = /* @__PURE__ */ function() {
    function SplitLast2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    SplitLast2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new SplitLast2(value0, value1, value22);
        };
      };
    };
    return SplitLast2;
  }();
  var unsafeNode = function(k, v, l, r) {
    if (l instanceof Leaf) {
      if (r instanceof Leaf) {
        return new Node(1, 1, k, v, l, r);
      }
      ;
      if (r instanceof Node) {
        return new Node(1 + r.value0 | 0, 1 + r.value1 | 0, k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 702, column 5 - line 706, column 39): " + [r.constructor.name]);
    }
    ;
    if (l instanceof Node) {
      if (r instanceof Leaf) {
        return new Node(1 + l.value0 | 0, 1 + l.value1 | 0, k, v, l, r);
      }
      ;
      if (r instanceof Node) {
        return new Node(1 + function() {
          var $280 = l.value0 > r.value0;
          if ($280) {
            return l.value0;
          }
          ;
          return r.value0;
        }() | 0, (1 + l.value1 | 0) + r.value1 | 0, k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 708, column 5 - line 712, column 68): " + [r.constructor.name]);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 700, column 32 - line 712, column 68): " + [l.constructor.name]);
  };
  var singleton4 = function(k) {
    return function(v) {
      return new Node(1, 1, k, v, Leaf.value, Leaf.value);
    };
  };
  var unsafeBalancedNode = /* @__PURE__ */ function() {
    var height10 = function(v) {
      if (v instanceof Leaf) {
        return 0;
      }
      ;
      if (v instanceof Node) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 757, column 12 - line 759, column 26): " + [v.constructor.name]);
    };
    var rotateLeft = function(k, v, l, rk, rv, rl, rr) {
      if (rl instanceof Node && rl.value0 > height10(rr)) {
        return unsafeNode(rl.value2, rl.value3, unsafeNode(k, v, l, rl.value4), unsafeNode(rk, rv, rl.value5, rr));
      }
      ;
      return unsafeNode(rk, rv, unsafeNode(k, v, l, rl), rr);
    };
    var rotateRight = function(k, v, lk, lv, ll, lr, r) {
      if (lr instanceof Node && height10(ll) <= lr.value0) {
        return unsafeNode(lr.value2, lr.value3, unsafeNode(lk, lv, ll, lr.value4), unsafeNode(k, v, lr.value5, r));
      }
      ;
      return unsafeNode(lk, lv, ll, unsafeNode(k, v, lr, r));
    };
    return function(k, v, l, r) {
      if (l instanceof Leaf) {
        if (r instanceof Leaf) {
          return singleton4(k)(v);
        }
        ;
        if (r instanceof Node && r.value0 > 1) {
          return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
        }
        ;
        return unsafeNode(k, v, l, r);
      }
      ;
      if (l instanceof Node) {
        if (r instanceof Node) {
          if (r.value0 > (l.value0 + 1 | 0)) {
            return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
          }
          ;
          if (l.value0 > (r.value0 + 1 | 0)) {
            return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
          }
          ;
        }
        ;
        if (r instanceof Leaf && l.value0 > 1) {
          return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
        }
        ;
        return unsafeNode(k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 717, column 40 - line 738, column 34): " + [l.constructor.name]);
    };
  }();
  var $lazy_unsafeSplit = /* @__PURE__ */ $runtime_lazy3("unsafeSplit", "Data.Map.Internal", function() {
    return function(comp, k, m) {
      if (m instanceof Leaf) {
        return new Split(Nothing.value, Leaf.value, Leaf.value);
      }
      ;
      if (m instanceof Node) {
        var v = comp(k)(m.value2);
        if (v instanceof LT) {
          var v1 = $lazy_unsafeSplit(793)(comp, k, m.value4);
          return new Split(v1.value0, v1.value1, unsafeBalancedNode(m.value2, m.value3, v1.value2, m.value5));
        }
        ;
        if (v instanceof GT) {
          var v1 = $lazy_unsafeSplit(796)(comp, k, m.value5);
          return new Split(v1.value0, unsafeBalancedNode(m.value2, m.value3, m.value4, v1.value1), v1.value2);
        }
        ;
        if (v instanceof EQ) {
          return new Split(new Just(m.value3), m.value4, m.value5);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 791, column 5 - line 799, column 30): " + [v.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 787, column 34 - line 799, column 30): " + [m.constructor.name]);
    };
  });
  var unsafeSplit = /* @__PURE__ */ $lazy_unsafeSplit(786);
  var $lazy_unsafeSplitLast = /* @__PURE__ */ $runtime_lazy3("unsafeSplitLast", "Data.Map.Internal", function() {
    return function(k, v, l, r) {
      if (r instanceof Leaf) {
        return new SplitLast(k, v, l);
      }
      ;
      if (r instanceof Node) {
        var v1 = $lazy_unsafeSplitLast(779)(r.value2, r.value3, r.value4, r.value5);
        return new SplitLast(v1.value0, v1.value1, unsafeBalancedNode(k, v, l, v1.value2));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 776, column 37 - line 780, column 57): " + [r.constructor.name]);
    };
  });
  var unsafeSplitLast = /* @__PURE__ */ $lazy_unsafeSplitLast(775);
  var unsafeJoinNodes = function(v, v1) {
    if (v instanceof Leaf) {
      return v1;
    }
    ;
    if (v instanceof Node) {
      var v2 = unsafeSplitLast(v.value2, v.value3, v.value4, v.value5);
      return unsafeBalancedNode(v2.value0, v2.value1, v2.value2, v1);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 764, column 25 - line 768, column 38): " + [v.constructor.name, v1.constructor.name]);
  };
  var lookup2 = function(dictOrd) {
    var compare2 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Node) {
            var v1 = compare2(k)(v.value2);
            if (v1 instanceof LT) {
              $copy_v = v.value4;
              return;
            }
            ;
            if (v1 instanceof GT) {
              $copy_v = v.value5;
              return;
            }
            ;
            if (v1 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value3);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 283, column 7 - line 286, column 22): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 280, column 8 - line 286, column 22): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go2;
    };
  };
  var foldableMap = {
    foldr: function(f) {
      return function(z) {
        var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
          return function(m$prime, z$prime) {
            if (m$prime instanceof Leaf) {
              return z$prime;
            }
            ;
            if (m$prime instanceof Node) {
              return $lazy_go(172)(m$prime.value4, f(m$prime.value3)($lazy_go(172)(m$prime.value5, z$prime)));
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 169, column 26 - line 172, column 43): " + [m$prime.constructor.name]);
          };
        });
        var go2 = $lazy_go(169);
        return function(m) {
          return go2(m, z);
        };
      };
    },
    foldl: function(f) {
      return function(z) {
        var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
          return function(z$prime, m$prime) {
            if (m$prime instanceof Leaf) {
              return z$prime;
            }
            ;
            if (m$prime instanceof Node) {
              return $lazy_go(178)(f($lazy_go(178)(z$prime, m$prime.value4))(m$prime.value3), m$prime.value5);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 175, column 26 - line 178, column 43): " + [m$prime.constructor.name]);
          };
        });
        var go2 = $lazy_go(175);
        return function(m) {
          return go2(z, m);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty6 = mempty(dictMonoid);
      var append14 = append(dictMonoid.Semigroup0());
      return function(f) {
        var go2 = function(v) {
          if (v instanceof Leaf) {
            return mempty6;
          }
          ;
          if (v instanceof Node) {
            return append14(go2(v.value4))(append14(f(v.value3))(go2(v.value5)));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 181, column 10 - line 184, column 28): " + [v.constructor.name]);
        };
        return go2;
      };
    }
  };
  var foldSubmapBy = function(dictOrd) {
    var lessThan1 = lessThan(dictOrd);
    var greaterThan1 = greaterThan(dictOrd);
    var lessThanOrEq1 = lessThanOrEq(dictOrd);
    return function(appendFn) {
      return function(memptyValue) {
        return function(kmin) {
          return function(kmax) {
            return function(f) {
              var tooSmall = function() {
                if (kmin instanceof Just) {
                  return function(k) {
                    return lessThan1(k)(kmin.value0);
                  };
                }
                ;
                if (kmin instanceof Nothing) {
                  return $$const(false);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 389, column 7 - line 393, column 22): " + [kmin.constructor.name]);
              }();
              var tooLarge = function() {
                if (kmax instanceof Just) {
                  return function(k) {
                    return greaterThan1(k)(kmax.value0);
                  };
                }
                ;
                if (kmax instanceof Nothing) {
                  return $$const(false);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 396, column 7 - line 400, column 22): " + [kmax.constructor.name]);
              }();
              var inBounds = function() {
                if (kmin instanceof Just && kmax instanceof Just) {
                  return function(k) {
                    return lessThanOrEq1(kmin.value0)(k) && lessThanOrEq1(k)(kmax.value0);
                  };
                }
                ;
                if (kmin instanceof Just && kmax instanceof Nothing) {
                  return function(k) {
                    return lessThanOrEq1(kmin.value0)(k);
                  };
                }
                ;
                if (kmin instanceof Nothing && kmax instanceof Just) {
                  return function(k) {
                    return lessThanOrEq1(k)(kmax.value0);
                  };
                }
                ;
                if (kmin instanceof Nothing && kmax instanceof Nothing) {
                  return $$const(true);
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 403, column 7 - line 411, column 21): " + [kmin.constructor.name, kmax.constructor.name]);
              }();
              var go2 = function(v) {
                if (v instanceof Leaf) {
                  return memptyValue;
                }
                ;
                if (v instanceof Node) {
                  return appendFn(appendFn(function() {
                    var $643 = tooSmall(v.value2);
                    if ($643) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value4);
                  }())(function() {
                    var $644 = inBounds(v.value2);
                    if ($644) {
                      return f(v.value2)(v.value3);
                    }
                    ;
                    return memptyValue;
                  }()))(function() {
                    var $645 = tooLarge(v.value2);
                    if ($645) {
                      return memptyValue;
                    }
                    ;
                    return go2(v.value5);
                  }());
                }
                ;
                throw new Error("Failed pattern match at Data.Map.Internal (line 413, column 10 - line 419, column 66): " + [v.constructor.name]);
              };
              return go2;
            };
          };
        };
      };
    };
  };
  var foldSubmap = function(dictOrd) {
    var foldSubmapBy1 = foldSubmapBy(dictOrd);
    return function(dictMonoid) {
      return foldSubmapBy1(append(dictMonoid.Semigroup0()))(mempty(dictMonoid));
    };
  };
  var empty2 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var $$delete = function(dictOrd) {
    var compare2 = compare(dictOrd);
    return function(k) {
      var go2 = function(v) {
        if (v instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v instanceof Node) {
          var v1 = compare2(k)(v.value2);
          if (v1 instanceof LT) {
            return unsafeBalancedNode(v.value2, v.value3, go2(v.value4), v.value5);
          }
          ;
          if (v1 instanceof GT) {
            return unsafeBalancedNode(v.value2, v.value3, v.value4, go2(v.value5));
          }
          ;
          if (v1 instanceof EQ) {
            return unsafeJoinNodes(v.value4, v.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 7 - line 501, column 43): " + [v1.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 8 - line 501, column 43): " + [v.constructor.name]);
      };
      return go2;
    };
  };
  var alter = function(dictOrd) {
    var compare2 = compare(dictOrd);
    return function(f) {
      return function(k) {
        return function(m) {
          var v = unsafeSplit(compare2, k, m);
          var v2 = f(v.value0);
          if (v2 instanceof Nothing) {
            return unsafeJoinNodes(v.value1, v.value2);
          }
          ;
          if (v2 instanceof Just) {
            return unsafeBalancedNode(k, v2.value0, v.value1, v.value2);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 514, column 3 - line 518, column 41): " + [v2.constructor.name]);
        };
      };
    };
  };

  // output/Data.Compactable/index.js
  var $$void3 = /* @__PURE__ */ $$void(functorST);
  var pure1 = /* @__PURE__ */ pure(applicativeST);
  var apply2 = /* @__PURE__ */ apply(applyST);
  var map5 = /* @__PURE__ */ map(functorST);
  var compactableArray = {
    compact: function(xs) {
      return function __do5() {
        var result = newSTArray();
        var iter = iterator(function(v) {
          return index(xs)(v);
        })();
        iterate(iter)(function($108) {
          return $$void3(function(v) {
            if (v instanceof Nothing) {
              return pure1(0);
            }
            ;
            if (v instanceof Just) {
              return push(v.value0)(result);
            }
            ;
            throw new Error("Failed pattern match at Data.Compactable (line 111, column 34 - line 113, column 35): " + [v.constructor.name]);
          }($108));
        })();
        return unsafeFreeze(result)();
      }();
    },
    separate: function(xs) {
      return function __do5() {
        var ls = newSTArray();
        var rs = newSTArray();
        var iter = iterator(function(v) {
          return index(xs)(v);
        })();
        iterate(iter)(function($109) {
          return $$void3(function(v) {
            if (v instanceof Left) {
              return push(v.value0)(ls);
            }
            ;
            if (v instanceof Right) {
              return push(v.value0)(rs);
            }
            ;
            throw new Error("Failed pattern match at Data.Compactable (line 122, column 34 - line 124, column 31): " + [v.constructor.name]);
          }($109));
        })();
        return apply2(map5(function(v) {
          return function(v1) {
            return {
              left: v,
              right: v1
            };
          };
        })(unsafeFreeze(ls)))(unsafeFreeze(rs))();
      }();
    }
  };
  var compact = function(dict) {
    return dict.compact;
  };

  // output/Data.Filterable/index.js
  var append3 = /* @__PURE__ */ append(semigroupArray);
  var foldl2 = /* @__PURE__ */ foldl(foldableArray);
  var maybeBool = function(p) {
    return function(x) {
      var $66 = p(x);
      if ($66) {
        return new Just(x);
      }
      ;
      return Nothing.value;
    };
  };
  var filterableArray = {
    partitionMap: function(p) {
      var go2 = function(acc) {
        return function(x) {
          var v = p(x);
          if (v instanceof Left) {
            return {
              right: acc.right,
              left: append3(acc.left)([v.value0])
            };
          }
          ;
          if (v instanceof Right) {
            return {
              left: acc.left,
              right: append3(acc.right)([v.value0])
            };
          }
          ;
          throw new Error("Failed pattern match at Data.Filterable (line 149, column 16 - line 151, column 50): " + [v.constructor.name]);
        };
      };
      return foldl2(go2)({
        left: [],
        right: []
      });
    },
    partition,
    filterMap: mapMaybe,
    filter,
    Compactable0: function() {
      return compactableArray;
    },
    Functor1: function() {
      return functorArray;
    }
  };
  var filterMap = function(dict) {
    return dict.filterMap;
  };
  var eitherBool = function(p) {
    return function(x) {
      var $84 = p(x);
      if ($84) {
        return new Right(x);
      }
      ;
      return new Left(x);
    };
  };

  // output/Effect.Uncurried/foreign.js
  var mkEffectFn1 = function mkEffectFn12(fn) {
    return function(x) {
      return fn(x)();
    };
  };
  var runEffectFn1 = function runEffectFn12(fn) {
    return function(a) {
      return function() {
        return fn(a);
      };
    };
  };

  // output/Effect.Uncurried/index.js
  var semigroupEffectFn1 = function(dictSemigroup) {
    var append9 = append(semigroupEffect(dictSemigroup));
    return {
      append: function(f1) {
        return function(f2) {
          return mkEffectFn1(function(a) {
            return append9(runEffectFn1(f1)(a))(runEffectFn1(f2)(a));
          });
        };
      }
    };
  };
  var monoidEffectFn1 = function(dictMonoid) {
    var mempty6 = mempty(monoidEffect(dictMonoid));
    var semigroupEffectFn11 = semigroupEffectFn1(dictMonoid.Semigroup0());
    return {
      mempty: mkEffectFn1(function(v) {
        return mempty6;
      }),
      Semigroup0: function() {
        return semigroupEffectFn11;
      }
    };
  };

  // output/FRP.Event.Class/index.js
  var map6 = /* @__PURE__ */ map(functorTuple);
  var pure3 = /* @__PURE__ */ pure(applicativeMaybe);
  var sampleOnRight = function(dict) {
    return dict.sampleOnRight;
  };
  var sampleOnRightOp = function(dictIsEvent) {
    var sampleOnRight1 = sampleOnRight(dictIsEvent);
    var map110 = map(dictIsEvent.Filterable2().Functor1());
    return function(ef) {
      return function(ea) {
        return sampleOnRight1(ef)(map110(applyFlipped)(ea));
      };
    };
  };
  var sampleOnLeft = function(dict) {
    return dict.sampleOnLeft;
  };
  var once = function(dict) {
    return dict.once;
  };
  var keepLatest = function(dict) {
    return dict.keepLatest;
  };
  var fix = function(dict) {
    return dict.fix;
  };
  var fold2 = function(dictIsEvent) {
    var fix1 = fix(dictIsEvent);
    var sampleOnRight1 = sampleOnRight(dictIsEvent);
    var alt7 = alt(dictIsEvent.Alt1());
    var Functor1 = dictIsEvent.Filterable2().Functor1();
    var voidLeft4 = voidLeft(Functor1);
    var once12 = once(dictIsEvent);
    var map110 = map(Functor1);
    return function(f) {
      return function(b) {
        return function(e) {
          return fix1(function(i) {
            return sampleOnRight1(alt7(i)(voidLeft4(once12(e))(b)))(map110(flip(f))(e));
          });
        };
      };
    };
  };
  var mapAccum = function(dictIsEvent) {
    var filterMap5 = filterMap(dictIsEvent.Filterable2());
    var fold12 = fold2(dictIsEvent);
    return function(f) {
      return function(acc) {
        return function(xs) {
          return filterMap5(snd)(fold12(function(v) {
            return function(b) {
              return map6(pure3)(f(v.value0)(b));
            };
          })(new Tuple(acc, Nothing.value))(xs));
        };
      };
    };
  };

  // output/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a) {
    return function(b) {
      return a === b;
    };
  }

  // output/Unsafe.Reference/index.js
  var unsafeRefEq = reallyUnsafeRefEq;

  // output/FRP.Event/index.js
  var $$void4 = /* @__PURE__ */ $$void(functorEffect);
  var liftST2 = /* @__PURE__ */ liftST(monadSTEffect);
  var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var pure4 = /* @__PURE__ */ pure(applicativeST);
  var void1 = /* @__PURE__ */ $$void(functorST);
  var join2 = /* @__PURE__ */ join(bindST);
  var liftST1 = /* @__PURE__ */ liftST(monadSTST);
  var append4 = /* @__PURE__ */ append(semigroupArray);
  var mempty2 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidEffectFn1(monoidUnit));
  var identity5 = /* @__PURE__ */ identity(categoryFn);
  var apply3 = /* @__PURE__ */ apply(applyST);
  var map1 = /* @__PURE__ */ map(functorST);
  var subscribe = function(v) {
    return function(k) {
      return function() {
        return v(false, mkEffectFn1(k));
      };
    };
  };
  var sampleOnRight2 = function(v) {
    return function(v1) {
      return function(b, k) {
        var latest = newSTRef(Nothing.value)();
        var c1 = v(b, function(a) {
          return $$void4(liftST2(write(new Just(a))(latest)))();
        });
        var c2 = v1(b, function(f) {
          var o = liftST2(read(latest))();
          return for_2(o)(function(a) {
            return function() {
              return k(f(a));
            };
          })();
        });
        return function __do5() {
          c1();
          return c2();
        };
      };
    };
  };
  var sampleOnLeft2 = function(v) {
    return function(v1) {
      return function(b, k) {
        var latest = newSTRef(Nothing.value)();
        var c1 = v(b, function(a) {
          var o = liftST2(read(latest))();
          return for_2(o)(function(f) {
            return function() {
              return k(f(a));
            };
          })();
        });
        var c2 = v1(b, function(f) {
          return liftST2(void1(write(new Just(f))(latest)))();
        });
        return function __do5() {
          c1();
          return c2();
        };
      };
    };
  };
  var once2 = function(v) {
    return function(b, k) {
      var latest = newSTRef(Nothing.value)();
      var u = newSTRef(pure4(unit))();
      var c = v(b, function(a) {
        var o2 = liftST2(read(latest))();
        if (o2 instanceof Nothing) {
          $$void4(liftST2(write(new Just(a))(latest)))();
          k(a);
          return liftST2(join2(read(u)))();
        }
        ;
        if (o2 instanceof Just) {
          return unit;
        }
        ;
        throw new Error("Failed pattern match at FRP.Event (line 185, column 9 - line 191, column 30): " + [o2.constructor.name]);
      });
      void1(write(c)(u))();
      var o = liftST1(read(latest))();
      (function() {
        if (o instanceof Just) {
          return c();
        }
        ;
        return unit;
      })();
      return c;
    };
  };
  var mergeMap = function(f0) {
    return function(f) {
      return function(tf, k) {
        var a = newSTArray();
        foreachE(f)(function(x) {
          var v = f0(x);
          return function __do5() {
            var u = v(tf, k);
            return void1(liftST1(push(u)(a)))();
          };
        })();
        return function __do5() {
          var o = liftST1(freeze(a))();
          return fastForeachThunk(o);
        };
      };
    };
  };
  var merge = function(f) {
    return function(tf, k) {
      var a = newSTArray();
      foreachE(f)(function(v) {
        return function __do5() {
          var u = v(tf, k);
          return void1(liftST1(push(u)(a)))();
        };
      })();
      return function __do5() {
        var o = liftST1(freeze(a))();
        return fastForeachThunk(o);
      };
    };
  };
  var makeLemmingEvent = function(e) {
    return function(tf, k) {
      var o = function(v) {
        return function(kx) {
          return function() {
            return v(tf, mkEffectFn1(kx));
          };
        };
      };
      return e(o)(function(a) {
        return function() {
          return k(a);
        };
      })();
    };
  };
  var mailbox$prime = function(dictOrd) {
    var alter3 = alter(dictOrd);
    var lookup5 = lookup2(dictOrd);
    return function __do5() {
      var r = newSTRef(empty2)();
      return {
        event: function(a) {
          return function(v, k2) {
            void1(modify(alter3(function(v1) {
              if (v1 instanceof Nothing) {
                return new Just([k2]);
              }
              ;
              if (v1 instanceof Just) {
                return new Just(append4(v1.value0)([k2]));
              }
              ;
              throw new Error("Failed pattern match at FRP.Event (line 547, column 17 - line 549, column 51): " + [v1.constructor.name]);
            })(a))(r))();
            return void1(modify(alter3(function(v1) {
              if (v1 instanceof Nothing) {
                return Nothing.value;
              }
              ;
              if (v1 instanceof Just) {
                return new Just(deleteBy(unsafeRefEq)(k2)(v1.value0));
              }
              ;
              throw new Error("Failed pattern match at FRP.Event (line 556, column 17 - line 558, column 65): " + [v1.constructor.name]);
            })(a))(r));
          };
        },
        push: function(v) {
          var o = liftST2(read(r))();
          var v1 = lookup5(v.address)(o);
          if (v1 instanceof Nothing) {
            return unit;
          }
          ;
          if (v1 instanceof Just) {
            return fastForeachE(v1.value0, function(i) {
              return i(v.payload);
            });
          }
          ;
          throw new Error("Failed pattern match at FRP.Event (line 565, column 9 - line 567, column 95): " + [v1.constructor.name]);
        }
      };
    };
  };
  var mailbox = function(dictOrd) {
    return function __do5() {
      var v = mailbox$prime(dictOrd)();
      return {
        push: function(ap2) {
          return function() {
            return v.push(ap2);
          };
        },
        event: v.event
      };
    };
  };
  var keepLatest2 = function(v) {
    return function(tf, k) {
      var cancelInner = newSTRef(pure4(unit))();
      var cancelOuter = v(tf, function(v1) {
        return liftST2(function __do5() {
          var ci = read(cancelInner)();
          ci();
          var c = v1(tf, k);
          return void1(liftST1(write(c)(cancelInner)))();
        })();
      });
      return function __do5() {
        var ci = read(cancelInner)();
        ci();
        return cancelOuter();
      };
    };
  };
  var functorEvent = {
    map: function(f) {
      return function(v) {
        return function(b, k) {
          return v(b, function(a) {
            return k(f(a));
          });
        };
      };
    }
  };
  var map22 = /* @__PURE__ */ map(functorEvent);
  var filter3 = function(p) {
    return function(v) {
      return function(tf, k) {
        return v(tf, function(a) {
          var v1 = p(a);
          if (v1 instanceof Just) {
            return k(v1.value0);
          }
          ;
          if (v1 instanceof Nothing) {
            return unit;
          }
          ;
          throw new Error("Failed pattern match at FRP.Event (line 206, column 31 - line 208, column 35): " + [v1.constructor.name]);
        });
      };
    };
  };
  var filter$prime = function(f) {
    return filter3(function(a) {
      var v = f(a);
      if (v) {
        return new Just(a);
      }
      ;
      if (!v) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at FRP.Event (line 112, column 13 - line 114, column 25): " + [v.constructor.name]);
    });
  };
  var create_ = function __do() {
    var subscribers = objHack();
    var idx = newSTRef(0)();
    return {
      event: function(v, k) {
        var rk = newSTRef(k)();
        var ix = read(idx)();
        insertObjHack(ix, rk, subscribers);
        void1(modify(function(v1) {
          return v1 + 1 | 0;
        })(idx))();
        return function __do5() {
          void1(write(mempty2)(rk))();
          deleteObjHack(ix, subscribers);
          return unit;
        };
      },
      push: function(a) {
        return function() {
          return fastForeachOhE(subscribers, function(rk) {
            var k = liftST2(read(rk))();
            return k(a);
          });
        };
      }
    };
  };
  var createPure = create_;
  var create$prime = function __do2() {
    var subscribers = objHack();
    var idx = newSTRef(0)();
    return {
      event: function(v, k) {
        var rk = newSTRef(k)();
        var ix = read(idx)();
        insertObjHack(ix, rk, subscribers);
        void1(modify(function(v1) {
          return v1 + 1 | 0;
        })(idx))();
        return function __do5() {
          void1(write(mempty2)(rk))();
          deleteObjHack(ix, subscribers);
          return unit;
        };
      },
      push: function(a) {
        return fastForeachOhE(subscribers, function(rk) {
          var k = liftST2(read(rk))();
          return k(a);
        });
      }
    };
  };
  var fix2 = function(f) {
    return function(tf, k) {
      var v = create$prime();
      var v1 = f(v.event);
      var c2 = v.event(tf, k);
      var c1 = v1(tf, v.push);
      return function __do5() {
        c1();
        return c2();
      };
    };
  };
  var create = create_;
  var compactableEvent = {
    compact: /* @__PURE__ */ filter3(identity5),
    separate: function(xs) {
      return {
        left: filter3(function(v) {
          if (v instanceof Left) {
            return new Just(v.value0);
          }
          ;
          if (v instanceof Right) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at FRP.Event (line 95, column 13 - line 97, column 33): " + [v.constructor.name]);
        })(xs),
        right: filter3(function(v) {
          if (v instanceof Right) {
            return new Just(v.value0);
          }
          ;
          if (v instanceof Left) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at FRP.Event (line 102, column 13 - line 104, column 32): " + [v.constructor.name]);
        })(xs)
      };
    }
  };
  var filterableEvent = {
    filter: filter$prime,
    filterMap: filter3,
    partition: function(p) {
      return function(xs) {
        return {
          yes: filter$prime(p)(xs),
          no: filter$prime(function($175) {
            return !p($175);
          })(xs)
        };
      };
    },
    partitionMap: function(f) {
      return function(xs) {
        return {
          left: filterMap(filterableEvent)(function() {
            var $176 = either(Just.create)($$const(Nothing.value));
            return function($177) {
              return $176(f($177));
            };
          }())(xs),
          right: filterMap(filterableEvent)(function($178) {
            return hush(f($178));
          })(xs)
        };
      };
    },
    Compactable0: function() {
      return compactableEvent;
    },
    Functor1: function() {
      return functorEvent;
    }
  };
  var biSampleOn = function(v) {
    return function(v1) {
      return function(tf, k) {
        var latest1 = newSTRef(Nothing.value)();
        var latest2 = newSTRef(Nothing.value)();
        var c1 = v(tf, function(a) {
          $$void4(liftST2(write(new Just(a))(latest1)))();
          var res = liftST2(read(latest2))();
          return for_2(res)(function(f) {
            return function() {
              return k(f(a));
            };
          })();
        });
        var c2 = v1(tf, function(f) {
          $$void4(liftST2(write(new Just(f))(latest2)))();
          var res = liftST2(read(latest1))();
          return for_2(res)(function(a) {
            return function() {
              return k(f(a));
            };
          })();
        });
        return function __do5() {
          c1();
          return c2();
        };
      };
    };
  };
  var applyEvent = {
    apply: function(a) {
      return function(b) {
        return biSampleOn(a)(map22(applyFlipped)(b));
      };
    },
    Functor0: function() {
      return functorEvent;
    }
  };
  var altEvent = {
    alt: function(v) {
      return function(v1) {
        return function(tf, k) {
          return apply3(map1(function(v2) {
            return function(v3) {
              return function __do5() {
                v2();
                return v3();
              };
            };
          })(function() {
            return v(tf, k);
          }))(function() {
            return v1(tf, k);
          })();
        };
      };
    },
    Functor0: function() {
      return functorEvent;
    }
  };
  var plusEvent = {
    empty: function(v, v1) {
      return pure4(unit);
    },
    Alt0: function() {
      return altEvent;
    }
  };
  var eventIsEvent = {
    keepLatest: keepLatest2,
    sampleOnRight: sampleOnRight2,
    sampleOnLeft: sampleOnLeft2,
    fix: fix2,
    once: once2,
    Plus0: function() {
      return plusEvent;
    },
    Alt1: function() {
      return altEvent;
    },
    Filterable2: function() {
      return filterableEvent;
    }
  };

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.Internal.FFI/foreign.js
  function _unsafeReadProtoTagged(nothing, just, name15, value15) {
    if (typeof window !== "undefined") {
      var ty = window[name15];
      if (ty != null && value15 instanceof ty) {
        return just(value15);
      }
    }
    var obj = value15;
    while (obj != null) {
      var proto = Object.getPrototypeOf(obj);
      var constructorName = proto.constructor.name;
      if (constructorName === name15) {
        return just(value15);
      } else if (constructorName === "Object") {
        return nothing;
      }
      obj = proto;
    }
    return nothing;
  }

  // output/Web.Internal.FFI/index.js
  var unsafeReadProtoTagged = function(name15) {
    return function(value15) {
      return _unsafeReadProtoTagged(Nothing.value, Just.create, name15, value15);
    };
  };

  // output/Data.Nullable/foreign.js
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }

  // output/Data.Nullable/index.js
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Web.HTML.HTMLCanvasElement/index.js
  var fromElement = /* @__PURE__ */ unsafeReadProtoTagged("HTMLCanvasElement");

  // output/Web.HTML.HTMLDocument/foreign.js
  function _body(doc) {
    return doc.body;
  }

  // output/Web.HTML.HTMLDocument/index.js
  var map7 = /* @__PURE__ */ map(functorEffect);
  var body = function(doc) {
    return map7(toMaybe)(function() {
      return _body(doc);
    });
  };

  // output/Web.HTML.HTMLElement/index.js
  var toElement = unsafeCoerce;

  // output/Web.HTML.HTMLInputElement/foreign.js
  function valueAsNumber(input3) {
    return function() {
      return input3.valueAsNumber;
    };
  }

  // output/Web.HTML.HTMLInputElement/index.js
  var fromEventTarget = /* @__PURE__ */ unsafeReadProtoTagged("HTMLInputElement");

  // output/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output/Data.Enum/index.js
  var bottom1 = /* @__PURE__ */ bottom(boundedChar);
  var top1 = /* @__PURE__ */ top(boundedChar);
  var fromEnum = function(dict) {
    return dict.fromEnum;
  };
  var defaultSucc = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a) {
        return toEnum$prime(fromEnum$prime(a) + 1 | 0);
      };
    };
  };
  var defaultPred = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a) {
        return toEnum$prime(fromEnum$prime(a) - 1 | 0);
      };
    };
  };
  var charToEnum = function(v) {
    if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
      return new Just(fromCharCode(v));
    }
    ;
    return Nothing.value;
  };
  var enumChar = {
    succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
    pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
    Ord0: function() {
      return ordChar;
    }
  };
  var boundedEnumChar = /* @__PURE__ */ function() {
    return {
      cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
      toEnum: charToEnum,
      fromEnum: toCharCode,
      Bounded0: function() {
        return boundedChar;
      },
      Enum1: function() {
        return enumChar;
      }
    };
  }();

  // output/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/FRP.Poll/index.js
  var pure5 = /* @__PURE__ */ pure(applicativeST);
  var map8 = /* @__PURE__ */ map(functorFn);
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var oneOf2 = /* @__PURE__ */ oneOf(foldableArray);
  var empty3 = /* @__PURE__ */ empty(plusMaybe);
  var $$void5 = /* @__PURE__ */ $$void(functorST);
  var join3 = /* @__PURE__ */ join(bindST);
  var when2 = /* @__PURE__ */ when(applicativeST);
  var once1 = /* @__PURE__ */ once(eventIsEvent);
  var sampleOnRightOp2 = /* @__PURE__ */ sampleOnRightOp(eventIsEvent);
  var composeFlipped2 = /* @__PURE__ */ composeFlipped(semigroupoidFn);
  var map12 = /* @__PURE__ */ map(functorMaybe);
  var liftST3 = /* @__PURE__ */ liftST(monadSTST);
  var for_3 = /* @__PURE__ */ for_(applicativeST)(foldableArray);
  var APoll = function(x) {
    return x;
  };
  var KeepLatestStart = /* @__PURE__ */ function() {
    function KeepLatestStart2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    KeepLatestStart2.create = function(value0) {
      return function(value1) {
        return new KeepLatestStart2(value0, value1);
      };
    };
    return KeepLatestStart2;
  }();
  var KeepLatestLast = /* @__PURE__ */ function() {
    function KeepLatestLast2(value0) {
      this.value0 = value0;
    }
    ;
    KeepLatestLast2.create = function(value0) {
      return new KeepLatestLast2(value0);
    };
    return KeepLatestLast2;
  }();
  var pollable = function(dictIsEvent) {
    return {
      sample: function(v) {
        return function(ab) {
          return v(ab);
        };
      }
    };
  };
  var pollable1 = /* @__PURE__ */ pollable(eventIsEvent);
  var sample = function(dict) {
    return dict.sample;
  };
  var sample1 = /* @__PURE__ */ sample(pollable1);
  var poll = APoll;
  var sham = function(dictIsEvent) {
    var keepLatest1 = keepLatest(dictIsEvent);
    var map29 = map(dictIsEvent.Filterable2().Functor1());
    return function(i) {
      return poll(function(e) {
        return keepLatest1(map29(function(f) {
          return map29(f)(i);
        })(e));
      });
    };
  };
  var sham1 = /* @__PURE__ */ sham(eventIsEvent);
  var stToPoll = function(ee) {
    return poll(function(e) {
      return makeLemmingEvent(function(s) {
        return function(k) {
          return s(e)(function(f) {
            return function __do5() {
              var $478 = ee();
              return k(f($478))();
            };
          });
        };
      });
    });
  };
  var once3 = function(dictPollable) {
    var sample22 = sample(dictPollable);
    return function(dictIsEvent) {
      var once22 = once(dictIsEvent);
      return function(a) {
        return poll(function(e) {
          return once22(sample22(a)(e));
        });
      };
    };
  };
  var merge2 = function(a) {
    return function(e) {
      return mergeMap(flip(sample1)(e))(a);
    };
  };
  var mailbox2 = function(dictOrd) {
    return function __do5() {
      var v = mailbox(dictOrd)();
      return {
        poll: map8(sham1)(v.event),
        push: v.push
      };
    };
  };
  var functorAPoll = function(dictFunctor) {
    var map29 = map(dictFunctor);
    return {
      map: function(f) {
        return function(v) {
          return function(e) {
            return v(map29(function(v1) {
              return function($481) {
                return v1(f($481));
              };
            })(e));
          };
        };
      }
    };
  };
  var sampleBy = function(dictPollable) {
    var sample22 = sample(dictPollable);
    return function(dictFunctor) {
      var map29 = map(functorAPoll(dictFunctor));
      return function(dictFunctor1) {
        var map32 = map(dictFunctor1);
        return function(f) {
          return function(b) {
            return function(e) {
              return sample22(map29(f)(b))(map32(applyFlipped)(e));
            };
          };
        };
      };
    };
  };
  var keepLatest3 = function(dictFilterable) {
    var filterMap1 = filterMap(dictFilterable);
    var Functor1 = dictFilterable.Functor1();
    return function(dictIsEvent) {
      var fix1 = fix(dictIsEvent);
      var oneOf1 = oneOf2(dictIsEvent.Plus0());
      var keepLatest1 = keepLatest(dictIsEvent);
      var once22 = once(dictIsEvent);
      return function(dictPollable) {
        var sampleBy22 = sampleBy(dictPollable)(Functor1)(Functor1);
        return function(a) {
          return function(e) {
            return filterMap1(function(v) {
              if (v instanceof KeepLatestLast) {
                return new Just(v.value0);
              }
              ;
              return Nothing.value;
            })(fix1(function(ie) {
              return oneOf1([sampleBy22(KeepLatestStart.create)(a)(e), keepLatest1(flip(filterMap1)(ie)(function(v) {
                if (v instanceof KeepLatestStart) {
                  return new Just(sampleBy22(function(bb) {
                    return function(v1) {
                      return new KeepLatestLast(v.value1(bb));
                    };
                  })(v.value0)(once22(ie)));
                }
                ;
                return empty3;
              }))]);
            }));
          };
        };
      };
    };
  };
  var sample_ = function(dictPollable) {
    var sampleBy22 = sampleBy(dictPollable);
    return function(dictFunctor) {
      var sampleBy3 = sampleBy22(dictFunctor);
      return function(dictFunctor1) {
        return sampleBy3(dictFunctor1)($$const);
      };
    };
  };
  var sample_1 = /* @__PURE__ */ sample_(pollable1)(functorEvent)(functorEvent);
  var rant = function(a) {
    return function __do5() {
      var ep = createPure();
      var started = newSTRef(false)();
      var unsub = newSTRef(pure5(unit))();
      return {
        unsubscribe: join3(read(unsub)),
        poll: poll(function(e) {
          return makeLemmingEvent(function(s) {
            return function(k) {
              return function __do6() {
                var st = read(started)();
                when2(!st)(function __do7() {
                  var unsubscribe = s(sample_1(a)(once1(e)))(ep.push)();
                  $$void5(write(true)(started))();
                  return $$void5(flip(write)(unsub)(unsubscribe))();
                })();
                var u3 = s(sampleOnRightOp2(e)(ep.event))(k)();
                return u3;
              };
            };
          });
        })
      };
    };
  };
  var sampleOnLeft3 = function(dictPollable) {
    var sample_22 = sample_(dictPollable);
    var sampleBy22 = sampleBy(dictPollable);
    return function(dictIsEvent) {
      var sampleOnLeft1 = sampleOnLeft(dictIsEvent);
      var Functor1 = dictIsEvent.Filterable2().Functor1();
      var sample_32 = sample_22(Functor1)(Functor1);
      var sampleBy3 = sampleBy22(Functor1)(Functor1);
      return function(a) {
        return function(b) {
          return poll(function(e) {
            return sampleOnLeft1(sample_32(a)(e))(sampleBy3(composeFlipped2)(b)(e));
          });
        };
      };
    };
  };
  var sampleOnRight3 = function(dictPollable) {
    var sample_22 = sample_(dictPollable);
    var sampleBy22 = sampleBy(dictPollable);
    return function(dictIsEvent) {
      var sampleOnRight1 = sampleOnRight(dictIsEvent);
      var Functor1 = dictIsEvent.Filterable2().Functor1();
      var sample_32 = sample_22(Functor1)(Functor1);
      var sampleBy3 = sampleBy22(Functor1)(Functor1);
      return function(a) {
        return function(b) {
          return poll(function(e) {
            return sampleOnRight1(sample_32(a)(e))(sampleBy3(composeFlipped2)(b)(e));
          });
        };
      };
    };
  };
  var altAPoll = function(dictAlt) {
    var alt7 = alt(dictAlt);
    var functorAPoll1 = functorAPoll(dictAlt.Functor0());
    return {
      alt: function(v) {
        return function(v1) {
          return function(e) {
            return alt7(v(e))(v1(e));
          };
        };
      },
      Functor0: function() {
        return functorAPoll1;
      }
    };
  };
  var plusAPoll = function(dictPlus) {
    var empty1 = empty(dictPlus);
    var altAPoll1 = altAPoll(dictPlus.Alt0());
    return {
      empty: function(v) {
        return empty1;
      },
      Alt0: function() {
        return altAPoll1;
      }
    };
  };
  var fix3 = function(dictPollable) {
    var sampleBy22 = sampleBy(dictPollable);
    return function(dictIsEvent) {
      var Functor1 = dictIsEvent.Filterable2().Functor1();
      var map29 = map(Functor1);
      var fix1 = fix(dictIsEvent);
      var sampleBy3 = sampleBy22(Functor1)(Functor1);
      var sham2 = sham(dictIsEvent);
      return function(f) {
        return poll(function(e) {
          return map29(function(v) {
            return v.value1(v.value0);
          })(fix1(function(ee) {
            return sampleBy3(Tuple.create)(f(sham2(map29(fst)(ee))))(e);
          }));
        });
      };
    };
  };
  var filterMap2 = function(dictCompactable) {
    var compact2 = compact(dictCompactable);
    return function(dictPollable) {
      var sampleBy22 = sampleBy(dictPollable);
      return function(dictFunctor) {
        var sampleBy3 = sampleBy22(dictFunctor)(dictFunctor);
        return function(f) {
          return function(b) {
            return poll(function(e) {
              return compact2(sampleBy3(function(a) {
                return function(ff2) {
                  return map12(ff2)(f(a));
                };
              })(b)(e));
            });
          };
        };
      };
    };
  };
  var partitionMap = function(dictPollable) {
    return function(dictCompactable) {
      var filterMap1 = filterMap2(dictCompactable)(dictPollable);
      return function(dictFunctor) {
        var map29 = map(functorAPoll(dictFunctor));
        var filterMap22 = filterMap1(dictFunctor);
        return function(f) {
          return function(b) {
            var fb = map29(f)(b);
            return {
              left: filterMap22(either(Just.create)($$const(Nothing.value)))(fb),
              right: filterMap22(either($$const(Nothing.value))(Just.create))(fb)
            };
          };
        };
      };
    };
  };
  var compactableAPoll = function(dictFunctor) {
    return function(dictCompactable) {
      var filterMap1 = filterMap2(dictCompactable);
      return function(dictPollable) {
        return {
          compact: filterMap1(dictPollable)(dictFunctor)(identity6),
          separate: partitionMap(dictPollable)(dictCompactable)(dictFunctor)(identity6)
        };
      };
    };
  };
  var filterableAPoll = function(dictFunctor) {
    var compactableAPoll1 = compactableAPoll(dictFunctor);
    var functorAPoll1 = functorAPoll(dictFunctor);
    return function(dictCompactable) {
      var filterMap1 = filterMap2(dictCompactable);
      var compactableAPoll2 = compactableAPoll1(dictCompactable);
      return function(dictPollable) {
        var filterMap22 = filterMap1(dictPollable)(dictFunctor);
        var partitionMap1 = partitionMap(dictPollable)(dictCompactable)(dictFunctor);
        var compactableAPoll3 = compactableAPoll2(dictPollable);
        return {
          filterMap: filterMap22,
          filter: function($482) {
            return filterMap22(maybeBool($482));
          },
          partitionMap: partitionMap1,
          partition: function(p) {
            return function(xs) {
              var o = partitionMap1(eitherBool(p))(xs);
              return {
                no: o.left,
                yes: o.right
              };
            };
          },
          Compactable0: function() {
            return compactableAPoll3;
          },
          Functor1: function() {
            return functorAPoll1;
          }
        };
      };
    };
  };
  var isEventAPoll = function(dictIsEvent) {
    var Filterable2 = dictIsEvent.Filterable2();
    var keepLatest1 = keepLatest3(Filterable2)(dictIsEvent);
    var plusAPoll1 = plusAPoll(dictIsEvent.Plus0());
    var altAPoll1 = altAPoll(dictIsEvent.Alt1());
    var filterableAPoll1 = filterableAPoll(Filterable2.Functor1())(Filterable2.Compactable0());
    return function(dictPlus) {
      return function(dictPollable) {
        var filterableAPoll2 = filterableAPoll1(dictPollable);
        return {
          sampleOnRight: sampleOnRight3(dictPollable)(dictIsEvent),
          sampleOnLeft: sampleOnLeft3(dictPollable)(dictIsEvent),
          keepLatest: keepLatest1(dictPollable),
          fix: fix3(dictPollable)(dictIsEvent),
          once: once3(dictPollable)(dictIsEvent),
          Plus0: function() {
            return plusAPoll1;
          },
          Alt1: function() {
            return altAPoll1;
          },
          Filterable2: function() {
            return filterableAPoll2;
          }
        };
      };
    };
  };
  var functorWithIndexAPoll = function(dictIsEvent) {
    var isEventAPoll1 = isEventAPoll(dictIsEvent)(dictIsEvent.Plus0());
    var functorAPoll1 = functorAPoll(dictIsEvent.Filterable2().Functor1());
    return function(dictPollable) {
      var mapAccum3 = mapAccum(isEventAPoll1(dictPollable));
      return {
        mapWithIndex: function(f) {
          return function(e) {
            return mapAccum3(function(a) {
              return function(b) {
                return new Tuple(a + 1 | 0, f(a)(b));
              };
            })(0)(e);
          };
        },
        Functor0: function() {
          return functorAPoll1;
        }
      };
    };
  };
  var deflect = function(a) {
    return function __do5() {
      var ep = newSTRef([])();
      var started = newSTRef(false)();
      var unsub = newSTRef(pure5(unit))();
      return poll(function(e) {
        return makeLemmingEvent(function(s) {
          return function(k) {
            return function __do6() {
              var st = read(started)();
              when2(!st)(function __do7() {
                var unsubscribe = s(sample_1(a)(once1(e)))(function() {
                  var $484 = flip(modify)(ep);
                  var $485 = flip(snoc);
                  return function($486) {
                    return $$void5(liftST3($484($485($486))));
                  };
                }())();
                $$void5(write(true)(started))();
                return $$void5(write(unsubscribe)(unsub))();
              })();
              var u3 = s(e)(function(f) {
                return function __do7() {
                  join3(read(unsub))();
                  var r = read(ep)();
                  return for_3(r)(function($487) {
                    return k(f($487));
                  })();
                };
              })();
              return u3;
            };
          };
        });
      });
    };
  };
  var create4 = function __do3() {
    var v = create();
    var v1 = rant(sham1(v.event))();
    return {
      poll: v1.poll,
      push: v.push
    };
  };
  var applyAPoll = function(dictApply) {
    var apply7 = apply(dictApply);
    var Functor0 = dictApply.Functor0();
    var map29 = map(Functor0);
    var voidLeft4 = voidLeft(Functor0);
    var functorAPoll1 = functorAPoll(Functor0);
    return {
      apply: function(v) {
        return function(v1) {
          return function(e) {
            return apply7(map29(function(ff2) {
              return function(v2) {
                return v2.value0(ff2(v2.value1));
              };
            })(v(voidLeft4(e)(identity6))))(v1(map29(Tuple.create)(e)));
          };
        };
      },
      Functor0: function() {
        return functorAPoll1;
      }
    };
  };
  var applicativeAPoll = function(dictApply) {
    var map29 = map(dictApply.Functor0());
    var applyAPoll1 = applyAPoll(dictApply);
    return {
      pure: function(a) {
        return function(e) {
          return map29(applyFlipped(a))(e);
        };
      },
      Apply0: function() {
        return applyAPoll1;
      }
    };
  };

  // output/Bolson.Core/index.js
  var Local = /* @__PURE__ */ function() {
    function Local2(value0) {
      this.value0 = value0;
    }
    ;
    Local2.create = function(value0) {
      return new Local2(value0);
    };
    return Local2;
  }();
  var Global = /* @__PURE__ */ function() {
    function Global2() {
    }
    ;
    Global2.value = new Global2();
    return Global2;
  }();
  var Remove = /* @__PURE__ */ function() {
    function Remove2() {
    }
    ;
    Remove2.value = new Remove2();
    return Remove2;
  }();
  var Logic = /* @__PURE__ */ function() {
    function Logic2(value0) {
      this.value0 = value0;
    }
    ;
    Logic2.create = function(value0) {
      return new Logic2(value0);
    };
    return Logic2;
  }();
  var DynamicChildren$prime = /* @__PURE__ */ function() {
    function DynamicChildren$prime2(value0) {
      this.value0 = value0;
    }
    ;
    DynamicChildren$prime2.create = function(value0) {
      return new DynamicChildren$prime2(value0);
    };
    return DynamicChildren$prime2;
  }();
  var FixedChildren$prime = /* @__PURE__ */ function() {
    function FixedChildren$prime2(value0) {
      this.value0 = value0;
    }
    ;
    FixedChildren$prime2.create = function(value0) {
      return new FixedChildren$prime2(value0);
    };
    return FixedChildren$prime2;
  }();
  var Element$prime = /* @__PURE__ */ function() {
    function Element$prime2(value0) {
      this.value0 = value0;
    }
    ;
    Element$prime2.create = function(value0) {
      return new Element$prime2(value0);
    };
    return Element$prime2;
  }();
  var eqScope = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Local && y instanceof Local) {
          return x.value0 === y.value0;
        }
        ;
        if (x instanceof Global && y instanceof Global) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var fixed = function(a) {
    return new FixedChildren$prime(a);
  };
  var dyn = function(a) {
    return new DynamicChildren$prime(a);
  };

  // output/Foreign.Object/foreign.js
  function _copyST(m) {
    return function() {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  }
  var empty4 = {};
  function runST(f) {
    return f();
  }
  function _foldM(bind9) {
    return function(f) {
      return function(mz) {
        return function(m) {
          var acc = mz;
          function g(k2) {
            return function(z) {
              return f(z)(k2)(m[k2]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind9(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Foreign.Object.ST/foreign.js
  var newImpl = function() {
    return {};
  };
  function poke2(k) {
    return function(v) {
      return function(m) {
        return function() {
          m[k] = v;
          return m;
        };
      };
    };
  }
  var deleteImpl = function(k) {
    return function(m) {
      return function() {
        delete m[k];
        return m;
      };
    };
  };

  // output/Foreign.Object/index.js
  var $$void6 = /* @__PURE__ */ $$void(functorST);
  var foldr4 = /* @__PURE__ */ foldr(foldableArray);
  var values = /* @__PURE__ */ toArrayWithKey(function(v) {
    return function(v1) {
      return v1;
    };
  });
  var thawST = _copyST;
  var mutate = function(f) {
    return function(m) {
      return runST(function __do5() {
        var s = thawST(m)();
        f(s)();
        return s;
      });
    };
  };
  var insert3 = function(k) {
    return function(v) {
      return mutate(poke2(k)(v));
    };
  };
  var fromFoldable2 = function(dictFoldable) {
    var fromFoldable1 = fromFoldable(dictFoldable);
    return function(l) {
      return runST(function __do5() {
        var s = newImpl();
        foreach(fromFoldable1(l))(function(v) {
          return $$void6(poke2(v.value0)(v.value1)(s));
        })();
        return s;
      });
    };
  };
  var fold3 = /* @__PURE__ */ _foldM(applyFlipped);
  var foldMap2 = function(dictMonoid) {
    var append14 = append(dictMonoid.Semigroup0());
    var mempty6 = mempty(dictMonoid);
    return function(f) {
      return fold3(function(acc) {
        return function(k) {
          return function(v) {
            return append14(acc)(f(k)(v));
          };
        };
      })(mempty6);
    };
  };
  var foldableObject = {
    foldl: function(f) {
      return fold3(function(z) {
        return function(v) {
          return f(z);
        };
      });
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr4(f)(z)(values(m));
        };
      };
    },
    foldMap: function(dictMonoid) {
      var foldMap12 = foldMap2(dictMonoid);
      return function(f) {
        return foldMap12($$const(f));
      };
    }
  };
  var $$delete3 = function(k) {
    return mutate(deleteImpl(k));
  };

  // output/Bolson.Control/index.js
  var map9 = /* @__PURE__ */ map(functorArray);
  var pollable2 = /* @__PURE__ */ pollable(eventIsEvent);
  var sample2 = /* @__PURE__ */ sample(pollable2);
  var bind2 = /* @__PURE__ */ bind(bindST);
  var pure6 = /* @__PURE__ */ pure(applicativeST);
  var liftST4 = /* @__PURE__ */ liftST(monadSTST);
  var sample_2 = /* @__PURE__ */ sample_(pollable2)(functorEvent)(functorEvent);
  var $$void7 = /* @__PURE__ */ $$void(functorST);
  var applySecond2 = /* @__PURE__ */ applySecond(applyST);
  var map13 = /* @__PURE__ */ map(functorST);
  var show2 = /* @__PURE__ */ show(showInt);
  var append5 = /* @__PURE__ */ append(/* @__PURE__ */ semigroupFn(semigroupString));
  var pure12 = /* @__PURE__ */ pure(applicativeFn);
  var append12 = /* @__PURE__ */ append(semigroupList);
  var append22 = /* @__PURE__ */ append(semigroupArray);
  var voidLeft2 = /* @__PURE__ */ voidLeft(functorEvent);
  var once4 = /* @__PURE__ */ once(eventIsEvent);
  var identity7 = /* @__PURE__ */ identity(categoryFn);
  var for_4 = /* @__PURE__ */ for_(applicativeST);
  var for_1 = /* @__PURE__ */ for_4(foldableArray);
  var for_22 = /* @__PURE__ */ for_4(foldableMaybe);
  var join4 = /* @__PURE__ */ join(bindST);
  var foldl3 = /* @__PURE__ */ foldl(foldableObject);
  var Listening = /* @__PURE__ */ function() {
    function Listening2() {
    }
    ;
    Listening2.value = new Listening2();
    return Listening2;
  }();
  var Closed = /* @__PURE__ */ function() {
    function Closed2() {
    }
    ;
    Closed2.value = new Closed2();
    return Closed2;
  }();
  var flatten = function(v) {
    return function(etty) {
      return function(psr) {
        return function(interpreter) {
          var element2 = function(v1) {
            return v1(psr)(interpreter);
          };
          if (etty instanceof FixedChildren$prime) {
            return poll(function(e) {
              return merge(map9(function(ex) {
                return sample2(flatten(v)(ex)(psr)(interpreter))(e);
              })(etty.value0));
            });
          }
          ;
          if (etty instanceof Element$prime) {
            return element2(v.toElt(etty.value0));
          }
          ;
          if (etty instanceof DynamicChildren$prime) {
            return poll(function(e0) {
              return makeLemmingEvent(function(subscribe2) {
                return function(k0) {
                  return function __do5() {
                    var urf = newSTRef(pure6(unit))();
                    var cancelInner = liftST4(newSTRef(empty4))();
                    var ugh = subscribe2(e0)(function(f) {
                      return function __do6() {
                        var fireId1 = liftST4(v.ids(interpreter))();
                        k0(f(v.deferPayload(interpreter)(psr.deferralPath)(v.forcePayload(interpreter)(snoc2(psr.deferralPath)(fireId1)))))();
                        var eepp = createPure();
                        var unsubscribe = subscribe2(sample_2(etty.value0)(e0))(eepp.push)();
                        var memoKids = {
                          unsubscribe,
                          event: eepp.event
                        };
                        $$void7(modify(function(v1) {
                          return applySecond2(v1)(memoKids.unsubscribe);
                        })(urf))();
                        var cancelOuter = subscribe2(memoKids.event)(function(inner) {
                          return function __do7() {
                            var fireId2 = liftST4(v.ids(interpreter))();
                            var myUnsubId = liftST4(v.ids(interpreter))();
                            var myUnsub = liftST4(newSTRef(pure6(unit)))();
                            var eltsUnsubId = liftST4(v.ids(interpreter))();
                            var eltsUnsub = liftST4(newSTRef(pure6(unit)))();
                            var myIds = liftST4(newSTRef([]))();
                            var myScope = liftST4(map13(Local.create)(function() {
                              if (psr.scope instanceof Global) {
                                return map13(show2)(v.ids(interpreter));
                              }
                              ;
                              if (psr.scope instanceof Local) {
                                return map13(append5(pure12(psr.scope.value0))(append5(pure12("!"))(show2)))(v.ids(interpreter));
                              }
                              ;
                              throw new Error("Failed pattern match at Bolson.Control (line 733, column 15 - line 735, column 74): " + [psr.scope.constructor.name]);
                            }()))();
                            var stageRef = liftST4(newSTRef(Listening.value))();
                            $$void7(liftST4(write(Listening.value)(stageRef)))();
                            var evt = sample2(flatten(v)(snd(inner))(function() {
                              var $112 = {};
                              for (var $113 in psr) {
                                if ({}.hasOwnProperty.call(psr, $113)) {
                                  $112[$113] = psr[$113];
                                }
                                ;
                              }
                              ;
                              $112.scope = myScope;
                              $112.deferralPath = append12(psr.deferralPath)(new Cons(fireId1, new Cons(fireId2, Nil.value)));
                              $112.raiseId = function(id2) {
                                return $$void7(modify(append22([id2]))(myIds));
                              };
                              return $112;
                            }())(interpreter))(voidLeft2(once4(memoKids.event))(identity7));
                            var c1 = liftST4(subscribe2(evt)(function($208) {
                              return k0(f($208));
                            }))();
                            $$void7(liftST4(modify(insert3(show2(eltsUnsubId))(c1))(cancelInner)))();
                            $$void7(liftST4(write(c1)(eltsUnsub)))();
                            var c0 = liftST4(subscribe2(sample_2(fst(inner))(once4(memoKids.event)))(function(kid$prime) {
                              return function __do8() {
                                var stage = liftST4(read(stageRef))();
                                if (kid$prime instanceof Logic && stage instanceof Listening) {
                                  var cid = liftST4(read(myIds))();
                                  return for_1(cid)(function() {
                                    var $209 = v.doLogic(kid$prime.value0)(interpreter);
                                    return function($210) {
                                      return k0(f($209($210)));
                                    };
                                  }())();
                                }
                                ;
                                if (kid$prime instanceof Remove && stage instanceof Listening) {
                                  $$void7(liftST4(write(Closed.value)(stageRef)))();
                                  var idRef = liftST4(read(myIds))();
                                  for_1(idRef)(function(old) {
                                    return for_22(psr.parent)(function(pnt) {
                                      return k0(f(v.disconnectElement(interpreter)({
                                        id: old,
                                        parent: pnt,
                                        scope: myScope
                                      })));
                                    });
                                  })();
                                  k0(f(v.forcePayload(interpreter)(append12(psr.deferralPath)(new Cons(fireId1, new Cons(fireId2, Nil.value))))))();
                                  var myu = liftST4(read(myUnsub))();
                                  liftST4(myu)();
                                  var eltu = liftST4(read(eltsUnsub))();
                                  liftST4(eltu)();
                                  $$void7(liftST4(modify($$delete3(show2(myUnsubId)))(cancelInner)))();
                                  return $$void7(liftST4(modify($$delete3(show2(eltsUnsubId)))(cancelInner)))();
                                }
                                ;
                                return unit;
                              };
                            }))();
                            $$void7(liftST4(write(c0)(myUnsub)))();
                            return $$void7(liftST4(modify(insert3(show2(myUnsubId))(c0))(cancelInner)))();
                          };
                        })();
                        return $$void7(modify(function(v1) {
                          return applySecond2(v1)(cancelOuter);
                        })(urf))();
                      };
                    })();
                    return function __do6() {
                      liftST4(join4(read(urf)))();
                      ugh();
                      return bind2(read(cancelInner))(foldl3(applySecond2)(pure6(unit)))();
                    };
                  };
                };
              });
            });
          }
          ;
          throw new Error("Failed pattern match at Bolson.Control (line 702, column 17 - line 800, column 58): " + [etty.constructor.name]);
        };
      };
    };
  };
  var behaving$prime = function(iii) {
    return poll(function(e) {
      return makeLemmingEvent(function(subscribe2) {
        return function(kx) {
          return function __do5() {
            var urf = newSTRef(pure6(unit))();
            var ugh = subscribe2(e)(function(f) {
              return iii(f)(e)(function($211) {
                return kx(f($211));
              })(function(z) {
                return function(fkx) {
                  return function __do6() {
                    var acsu = subscribe2(z)(fkx(kx))();
                    return $$void7(modify(function(v) {
                      return applySecond2(v)(acsu);
                    })(urf))();
                  };
                };
              });
            })();
            return function __do6() {
              liftST4(join4(read(urf)))();
              return ugh();
            };
          };
        };
      });
    });
  };
  var behaving_ = function(iii) {
    return behaving$prime(function(v) {
      return iii;
    });
  };
  var behaving = function(iii) {
    return behaving_(function(a) {
      return function(b) {
        return function(c) {
          return iii(a)(b)(flip(c)(identity7));
        };
      };
    });
  };

  // output/Data.Profunctor/index.js
  var identity8 = /* @__PURE__ */ identity(categoryFn);
  var profunctorFn = {
    dimap: function(a2b) {
      return function(c2d) {
        return function(b2c) {
          return function($18) {
            return c2d(b2c(a2b($18)));
          };
        };
      };
    }
  };
  var dimap = function(dict) {
    return dict.dimap;
  };
  var lcmap = function(dictProfunctor) {
    var dimap1 = dimap(dictProfunctor);
    return function(a2b) {
      return dimap1(a2b)(identity8);
    };
  };

  // output/Deku.Attribute/index.js
  var Cb = function(x) {
    return x;
  };
  var Prop$prime = /* @__PURE__ */ function() {
    function Prop$prime2(value0) {
      this.value0 = value0;
    }
    ;
    Prop$prime2.create = function(value0) {
      return new Prop$prime2(value0);
    };
    return Prop$prime2;
  }();
  var Cb$prime = /* @__PURE__ */ function() {
    function Cb$prime2(value0) {
      this.value0 = value0;
    }
    ;
    Cb$prime2.create = function(value0) {
      return new Cb$prime2(value0);
    };
    return Cb$prime2;
  }();
  var Unset$prime = /* @__PURE__ */ function() {
    function Unset$prime2() {
    }
    ;
    Unset$prime2.value = new Unset$prime2();
    return Unset$prime2;
  }();
  var Attribute = function(x) {
    return x;
  };
  var unsafeUnAttribute = /* @__PURE__ */ coerce();
  var unsafeAttribute = Attribute;
  var prop$prime = /* @__PURE__ */ function() {
    return Prop$prime.create;
  }();
  var cb$prime = /* @__PURE__ */ function() {
    return Cb$prime.create;
  }();
  var cb = /* @__PURE__ */ function() {
    var $10 = map(functorFn)(map(functorEffect)($$const(true)));
    return function($11) {
      return Cb($10($11));
    };
  }();

  // output/Deku.Core/index.js
  var lcmap2 = /* @__PURE__ */ lcmap(profunctorFn);
  var eq2 = /* @__PURE__ */ eq(eqScope);
  var show3 = /* @__PURE__ */ show(showInt);
  var pure7 = /* @__PURE__ */ pure(applicativeST);
  var sample3 = /* @__PURE__ */ sample(/* @__PURE__ */ pollable(eventIsEvent));
  var for_5 = /* @__PURE__ */ for_(applicativeST)(foldableArray);
  var append6 = /* @__PURE__ */ append(semigroupArray);
  var map10 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var map14 = /* @__PURE__ */ map(functorArray);
  var empty5 = /* @__PURE__ */ empty(plusEvent);
  var Child = function(x) {
    return x;
  };
  var unsafeSetPos$prime = function(i) {
    return function(v) {
      var g = function(v1) {
        var f = function(ii) {
          if (ii instanceof Element$prime) {
            return new Element$prime(lcmap2(function(v2) {
              return {
                deferralPath: v2.deferralPath,
                dynFamily: v2.dynFamily,
                ez: v2.ez,
                parent: v2.parent,
                raiseId: v2.raiseId,
                scope: v2.scope,
                pos: i
              };
            })(ii.value0));
          }
          ;
          return ii;
        };
        return f(v1);
      };
      return g(v);
    };
  };
  var unsafeSetPos = function($95) {
    return unsafeSetPos$prime(Just.create($95));
  };
  var sendToPos = function(i) {
    return new Logic(i);
  };
  var remove = /* @__PURE__ */ function() {
    return Remove.value;
  }();
  var flattenArgs = {
    doLogic: function(pos) {
      return function(v) {
        return function(id2) {
          return v.sendToPos({
            id: id2,
            pos
          });
        };
      };
    },
    deferPayload: function(v) {
      return v.deferPayload;
    },
    forcePayload: function(v) {
      return v.forcePayload;
    },
    ids: /* @__PURE__ */ function() {
      var $96 = unwrap();
      return function($97) {
        return function(v) {
          return v.ids;
        }($96($97));
      };
    }(),
    disconnectElement: function(v) {
      return function(v1) {
        return v.disconnectElement({
          id: v1.id,
          scope: v1.scope,
          parent: v1.parent,
          scopeEq: eq2
        });
      };
    },
    toElt: function(v) {
      return v;
    }
  };
  var __internalDekuFlatten = function(a) {
    return function(b) {
      return function(c) {
        return flatten(flattenArgs)(/* @__PURE__ */ function(v) {
          return v;
        }(a))(b)(c);
      };
    };
  };
  var dynify = function(dfun) {
    return function(es) {
      var go2 = function(fes) {
        return function(v) {
          return function(v1) {
            return behaving(function(e) {
              return function(kx) {
                return function(subscribe2) {
                  return function __do5() {
                    var me = v1.ids();
                    v.raiseId(show3(me))();
                    var v2 = function() {
                      if (v.parent instanceof Nothing) {
                        var dummyParent = v1.ids();
                        return new Tuple([v1.makeElement({
                          id: show3(dummyParent),
                          parent: Nothing.value,
                          scope: v.scope,
                          tag: "div",
                          ns: Nothing.value,
                          pos: Nothing.value,
                          dynFamily: Nothing.value
                        })], show3(dummyParent));
                      }
                      ;
                      if (v.parent instanceof Just) {
                        return new Tuple([], v.parent.value0);
                      }
                      ;
                      throw new Error("Failed pattern match at Deku.Core (line 355, column 32 - line 371, column 31): " + [v.parent.constructor.name]);
                    }();
                    var evt = sample3(__internalDekuFlatten(fes)({
                      parent: new Just(v2.value1),
                      scope: v.scope,
                      ez: false,
                      raiseId: function(v3) {
                        return pure7(unit);
                      },
                      deferralPath: v.deferralPath,
                      pos: Nothing.value,
                      dynFamily: new Just(show3(me))
                    })(v1))(e);
                    for_5(append6(v2.value0)([v1.makeDynBeacon({
                      id: show3(me),
                      parent: new Just(v2.value1),
                      scope: v.scope,
                      dynFamily: v.dynFamily,
                      pos: v.pos
                    }), v1.attributeParent({
                      id: show3(me),
                      parent: v2.value1,
                      pos: v.pos,
                      dynFamily: v.dynFamily,
                      ez: v.ez
                    })]))(kx)();
                    for_5([v1.removeDynBeacon({
                      id: show3(me)
                    })])(function() {
                      var $98 = v1.deferPayload(v.deferralPath);
                      return function($99) {
                        return kx($98($99));
                      };
                    }())();
                    return subscribe2(evt)();
                  };
                };
              };
            });
          };
        };
      };
      var go$prime = function(x) {
        return new Element$prime(go2(x));
      };
      return go$prime(/* @__PURE__ */ function(v) {
        return v;
      }(dfun(es)));
    };
  };
  var dyn2 = /* @__PURE__ */ function() {
    var myDyn$prime = function(x) {
      return dyn(x);
    };
    var bolsonify = function(v) {
      return new Tuple(map10(function(v1) {
        return v1;
      })(v.value0), /* @__PURE__ */ function(v1) {
        return v1;
      }(v.value1));
    };
    var myDyn = function(e) {
      return myDyn$prime(map10(bolsonify)(e));
    };
    return dynify(myDyn);
  }();
  var fixed2 = /* @__PURE__ */ function() {
    var myFixed$prime = function(x) {
      return fixed(map14(function(v) {
        return v;
      })(x));
    };
    var myFixed = function(e) {
      return myFixed$prime(map14(function(v) {
        return v;
      })(e));
    };
    return dynify(myFixed);
  }();
  var semigroupNut = {
    append: function(a) {
      return function(b) {
        return fixed2([a, b]);
      };
    }
  };
  var monoidNut = /* @__PURE__ */ function() {
    return {
      mempty: new Element$prime(function(v) {
        return function(v1) {
          return poll(function(v2) {
            return empty5;
          });
        };
      }),
      Semigroup0: function() {
        return semigroupNut;
      }
    };
  }();

  // output/Deku.Control/index.js
  var show4 = /* @__PURE__ */ show(showInt);
  var for_6 = /* @__PURE__ */ for_(applicativeST);
  var for_12 = /* @__PURE__ */ for_6(foldableMaybe);
  var pollable3 = /* @__PURE__ */ pollable(eventIsEvent);
  var sampleBy2 = /* @__PURE__ */ sampleBy(pollable3)(functorEvent)(functorEvent);
  var pure8 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeAPoll(applyEvent));
  var for_23 = /* @__PURE__ */ for_6(foldableArray);
  var pure13 = /* @__PURE__ */ pure(applicativeList);
  var sample4 = /* @__PURE__ */ sample(pollable3);
  var pure22 = /* @__PURE__ */ pure(applicativeST);
  var empty6 = /* @__PURE__ */ empty(/* @__PURE__ */ plusAPoll(plusEvent));
  var coerce3 = /* @__PURE__ */ coerce();
  var mapWithIndex3 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
  var map11 = /* @__PURE__ */ map(functorFn);
  var unsafeSetText = function(v) {
    return function(id2) {
      return function(txt) {
        return v.setText(/* @__PURE__ */ function(v1) {
          return {
            id: id2,
            text: v1
          };
        }(txt));
      };
    };
  };
  var unsafeSetAttribute = function(v) {
    return function(id2) {
      return function(v1) {
        if (v1.value instanceof Prop$prime) {
          return v.setProp({
            id: id2,
            key: v1.key,
            value: v1.value.value0
          });
        }
        ;
        if (v1.value instanceof Cb$prime) {
          return v.setCb({
            id: id2,
            key: v1.key,
            value: v1.value.value0
          });
        }
        ;
        if (v1.value instanceof Unset$prime) {
          return v.unsetAttribute({
            id: id2,
            key: v1.key
          });
        }
        ;
        throw new Error("Failed pattern match at Deku.Control (line 66, column 3 - line 69, column 41): " + [v1.value.constructor.name]);
      };
    };
  };
  var text5 = function(t2) {
    var go2 = function(v) {
      return function(v1) {
        return behaving(function(e) {
          return function(kx) {
            return function(subscribe2) {
              return function __do5() {
                var me = v1.ids();
                v.raiseId(show4(me))();
                kx(v1.makeText({
                  id: show4(me),
                  parent: v.parent,
                  pos: v.pos,
                  scope: v.scope,
                  dynFamily: v.dynFamily
                }))();
                for_12(v.parent)(function(p) {
                  return kx(v1.attributeParent({
                    id: show4(me),
                    parent: p,
                    pos: v.pos,
                    dynFamily: v.dynFamily,
                    ez: v.ez
                  }));
                })();
                kx(v1.deferPayload(v.deferralPath)(v1.deleteFromCache({
                  id: show4(me)
                })))();
                return subscribe2(sampleBy2(function(ttt) {
                  return function(fff) {
                    return fff(unsafeSetText(v1)(show4(me))(ttt));
                  };
                })(t2)(e))();
              };
            };
          };
        });
      };
    };
    var go$prime = new Element$prime(go2);
    return go$prime;
  };
  var text_ = function(s) {
    return text5(pure8(s));
  };
  var __internalDekuFlatten2 = function(v) {
    return function(a) {
      return function(b) {
        return flatten(flattenArgs)(v)(a)(b);
      };
    };
  };
  var deku = function(root) {
    return function(v) {
      var go2 = function(children) {
        return function(v1) {
          return behaving(function(ee) {
            return function(kx) {
              return function(subscribe2) {
                return function __do5() {
                  var headRedecorator = v1.ids();
                  kx(v1.makeRoot({
                    id: "deku-root",
                    root
                  }))();
                  for_23([v1.forcePayload(pure13(headRedecorator)), v1.deleteFromCache({
                    id: "deku-root"
                  })])(function() {
                    var $125 = v1.deferPayload(pure13(headRedecorator));
                    return function($126) {
                      return kx($125($126));
                    };
                  }())();
                  return subscribe2(sample4(__internalDekuFlatten2(children)({
                    parent: new Just("deku-root"),
                    deferralPath: pure13(headRedecorator),
                    scope: new Local("rootScope"),
                    raiseId: function(v2) {
                      return pure22(unit);
                    },
                    ez: true,
                    pos: Nothing.value,
                    dynFamily: Nothing.value
                  })(v1))(ee))();
                };
              };
            };
          });
        };
      };
      return go2(v);
    };
  };
  var elementify = function(ns) {
    return function(tag) {
      return function(atts) {
        return function(children) {
          var go2 = function(v) {
            return function(v1) {
              return behaving(function(ee) {
                return function(kx) {
                  return function(subscribe2) {
                    return function __do5() {
                      var me = v1.ids();
                      v.raiseId(show4(me))();
                      kx(v1.makeElement({
                        id: show4(me),
                        parent: v.parent,
                        scope: v.scope,
                        ns,
                        tag,
                        pos: v.pos,
                        dynFamily: v.dynFamily
                      }))();
                      for_12(v.parent)(function(p) {
                        return kx(v1.attributeParent({
                          id: show4(me),
                          parent: p,
                          pos: v.pos,
                          dynFamily: v.dynFamily,
                          ez: v.ez
                        }));
                      })();
                      kx(v1.deferPayload(v.deferralPath)(v1.deleteFromCache({
                        id: show4(me)
                      })))();
                      subscribe2(sample4(__internalDekuFlatten2(children)({
                        parent: new Just(show4(me)),
                        deferralPath: v.deferralPath,
                        scope: v.scope,
                        ez: true,
                        raiseId: function(v2) {
                          return pure22(unit);
                        },
                        pos: Nothing.value,
                        dynFamily: Nothing.value
                      })(v1))(ee))();
                      return subscribe2(sampleBy2(function(zzz) {
                        return function(fff) {
                          return fff(unsafeSetAttribute(v1)(show4(me))(unsafeUnAttribute(zzz)));
                        };
                      })(atts)(ee))();
                    };
                  };
                };
              });
            };
          };
          return go2;
        };
      };
    };
  };
  var elementify2 = function(ns) {
    return function(en) {
      return function(attributes) {
        return function(kids) {
          var aa = function(v) {
            if (v.length === 0) {
              return empty6;
            }
            ;
            if (v.length === 1) {
              return v[0];
            }
            ;
            return merge2(v);
          };
          var step1 = function(arr) {
            return new Element$prime(elementify(ns)(en)(aa(attributes))(fixed(coerce3(arr))));
          };
          return step1(mapWithIndex3(map11(map11(function(v) {
            return v;
          }))(unsafeSetPos))(kids));
        };
      };
    };
  };

  // output/Deku.Interpret/foreign.js
  var associateWithUnsubscribe_ = (a) => (state3) => () => {
    state3.units[a.id].unsubscribe = a.unsubscribe;
  };
  var attributeParent_ = (runOnJust2) => (a) => (state3) => () => {
    if (state3.units[a.id]) {
      const dom2 = state3.units[a.parent].main;
      if (!(state3.units[a.id].main && state3.units[a.id].main.parentNode || state3.units[a.id].startBeacon && state3.units[a.id].startBeacon.parentNode)) {
        const iRan = a.ez ? (() => {
          if (state3.units[a.id].main) {
            dom2.appendChild(state3.units[a.id].main);
          } else {
            dom2.appendChild(state3.units[a.id].startBeacon);
            dom2.appendChild(state3.units[a.id].endBeacon);
          }
          return true;
        })() : runOnJust2(a.pos)((pos) => () => {
          return runOnJust2(a.dynFamily)((dynFamily) => () => {
            var i = 0;
            var j = 0;
            var terminalDyn;
            while (j < dom2.childNodes.length) {
              if (dom2.childNodes[j].nodeType === 8 && dom2.childNodes[j].nodeValue === "%-%" + dynFamily) {
                j += 1;
                break;
              }
              j++;
            }
            const inserter = (k) => {
              const anchorNode = dom2.childNodes[k];
              if (state3.units[a.id].startBeacon) {
                dom2.insertBefore(
                  state3.units[a.id].startBeacon,
                  anchorNode
                );
                dom2.insertBefore(
                  state3.units[a.id].endBeacon,
                  anchorNode
                );
              } else {
                dom2.insertBefore(state3.units[a.id].main, anchorNode);
              }
            };
            while (j < dom2.childNodes.length) {
              var tmpDekuId;
              if (tmpDekuId = dom2.childNodes[j].$dekuId) {
                const insertHappened = runOnJust2(
                  state3.units[tmpDekuId].dynFamily
                )((tmpDynFamily) => () => {
                  const insertHappened2 = runOnJust2(
                    state3.units[tmpDekuId].pos
                  )((tmpPos) => () => {
                    if (dynFamily === tmpDynFamily && pos <= tmpPos) {
                      inserter(j);
                      return true;
                    }
                    return false;
                  })();
                  return insertHappened2;
                })();
                if (insertHappened) {
                  return true;
                }
              }
              if (i === pos) {
                inserter(j);
                return true;
              }
              if (dom2.childNodes[j].nodeType === 8 && dom2.childNodes[j].nodeValue === "%-%" + dynFamily + "%-%") {
                inserter(j);
                return true;
              }
              if (dom2.childNodes[j].nodeType === 8 && dom2.childNodes[j].nodeValue.substring(0, 3) === "%-%" && !terminalDyn) {
                terminalDyn = dom2.childNodes[j].nodeValue + "%-%";
              }
              if (!terminalDyn) {
                i++;
              }
              if (dom2.childNodes[j].nodeType === 8 && dom2.childNodes[j].nodeValue === terminalDyn) {
                terminalDyn = void 0;
                i++;
              }
              j++;
            }
            return false;
          })();
        })();
        if (!iRan) {
          if (a.parent.indexOf("@!%") !== -1) {
            const usedDynBeacon = runOnJust2(a.dynFamily)((df) => () => {
              if (state3.units[a.id].main) {
                state3.units[df].endBeacon.parentNode.insertBefore(
                  state3.units[a.id].main,
                  state3.units[df].endBeacon
                );
              } else {
                state3.units[df].endBeacon.parentNode.insertBefore(
                  state3.units[a.id].endBeacon,
                  state3.units[df].endBeacon
                );
                state3.units[df].endBeacon.parentNode.insertBefore(
                  state3.units[a.id].startBeacon,
                  state3.units[a.id].endBeacon
                );
              }
              return true;
            })();
            if (usedDynBeacon) {
            } else if (state3.units[a.id].main) {
              dom2.parentNode.replaceChild(state3.units[a.id].main, dom2);
            } else {
              dom2.parentNode.replaceChild(state3.units[a.id].endBeacon, dom2);
              state3.units[a.id].endBeacon.parentNode.insertBefore(
                state3.units[a.id].startBeacon,
                state3.units[a.id].endBeacon
              );
            }
          } else {
            const hasADynFamily = runOnJust2(a.dynFamily)((dynFamily) => () => {
              if (state3.units[a.id].startBeacon) {
                dom2.insertBefore(
                  state3.units[a.id].startBeacon,
                  state3.units[dynFamily].endBeacon
                );
                dom2.insertBefore(
                  state3.units[a.id].endBeacon,
                  state3.units[dynFamily].endBeacon
                );
              } else {
                dom2.insertBefore(
                  state3.units[a.id].main,
                  state3.units[dynFamily].endBeacon
                );
              }
              return true;
            })();
            if (!hasADynFamily) {
              if (state3.units[a.id].startBeacon) {
                dom2.appendChild(state3.units[a.id].startBeacon);
                dom2.appendChild(state3.units[a.id].endBeacon);
              } else {
                dom2.appendChild(state3.units[a.id].main);
              }
            }
          }
        }
      }
    }
  };
  var makeDynBeacon_ = (runOnJust2) => (tryHydration) => (a) => (state3) => () => {
    var startBeacon;
    var endBeacon;
    var ptr = a.id;
    if (!state3.scopes[a.scope]) {
      state3.scopes[a.scope] = [];
    }
    state3.scopes[a.scope].push(ptr);
    const iRan = runOnJust2(a.parent)(() => () => {
      if (state3.hydrating && tryHydration && (startBeacon = state3.allBeacons[a.id]) && (endBeacon = state3.allBeacons[`${a.id}%-%`])) {
        state3.units[ptr] = {
          listeners: {},
          parent: a.parent,
          scope: a.scope,
          pos: a.pos,
          dynFamily: a.dynFamily,
          startBeacon,
          endBeacon
        };
        startBeacon.$dekuId = ptr;
        endBeacon.$dekuId = ptr;
        return true;
      }
      return false;
    })();
    if (!iRan) {
      const startBeacon2 = document.createComment(`%-%${a.id}`);
      const endBeacon2 = document.createComment(`%-%${a.id}%-%`);
      state3.units[ptr] = {
        listeners: {},
        parent: a.parent,
        dynFamily: a.dynFamily,
        scope: a.scope,
        pos: a.pos,
        startBeacon: startBeacon2,
        endBeacon: endBeacon2
      };
      startBeacon2.$dekuId = ptr;
      endBeacon2.$dekuId = ptr;
    }
  };
  var getDynFamily = (id2) => (state3) => () => state3.units[id2] && state3.units[id2].dynFamily ? state3.units[id2].dynFamily : (() => {
    throw new Error(`No dyn family for ${id2}`);
  })();
  var getParent = (id2) => (state3) => () => state3.units[id2] && state3.units[id2].main && state3.units[id2].main.parentNode && state3.units[id2].main.parentNode.$dekuId ? state3.units[id2].main.parentNode.$dekuId : state3.units[id2] && state3.units[id2].startBeacon && state3.units[id2].startBeacon.parentNode && state3.units[id2].startBeacon.parentNode.$dekuId ? state3.units[id2].startBeacon.parentNode.$dekuId : (() => {
    throw new Error(`No parent information for ${id2}`);
  })();
  var getScope = (id2) => (state3) => () => state3.units[id2] && state3.units[id2].scope ? state3.units[id2].scope : (() => {
    throw new Error(`No scope information for ${id2}`);
  })();
  var makeElement_ = (runOnJust2) => (tryHydration) => (a) => (state3) => () => {
    var dom2;
    var ptr = a.id;
    if (!state3.scopes[a.scope]) {
      state3.scopes[a.scope] = [];
    }
    state3.scopes[a.scope].push(ptr);
    const iRan = runOnJust2(a.parent)(() => () => {
      if (state3.hydrating && tryHydration && (dom2 = document.documentElement.querySelector(
        `[data-deku-ssr="${ptr}"]`
      ))) {
        state3.units[ptr] = {
          listeners: {},
          pos: a.pos,
          parent: a.parent,
          scope: a.scope,
          dynFamily: a.dynFamily,
          main: dom2
        };
        dom2.$dekuId = ptr;
        return true;
      }
      return false;
    })();
    if (!iRan) {
      let namespace = null;
      runOnJust2(a.ns)((ns) => () => {
        namespace = ns;
        return true;
      })();
      const main2 = namespace === null ? document.createElement(a.tag) : document.createElementNS(namespace, a.tag);
      state3.units[ptr] = {
        listeners: {},
        parent: a.parent,
        pos: a.pos,
        scope: a.scope,
        dynFamily: a.dynFamily,
        main: main2
      };
      main2.$dekuId = ptr;
    }
  };
  var makeText_ = (runOnJust2) => (tryHydration) => (maybe2) => (a) => (state3) => () => {
    var ptr = a.id;
    var dom2;
    if (!state3.scopes[a.scope]) {
      state3.scopes[a.scope] = [];
    }
    state3.scopes[a.scope].push(ptr);
    const iRan = runOnJust2(a.parent)((parent2) => () => {
      if (state3.hydrating && tryHydration && // hack
      (dom2 = document.documentElement.querySelector(`[data-deku-ssr="${parent2}"]`))) {
        var i = 0;
        for (; i < dom2.childNodes.length; i++) {
          const ptrSplit = ptr.split("@-@");
          if (dom2.childNodes[i].nodeType === 8 && dom2.childNodes[i].nodeValue === ptrSplit[0]) {
            var textWasBlank = i === 0 || dom2.childNodes[i - 1].nodeType !== 3;
            if (textWasBlank && i !== 0) {
              dom2.insertBefore(
                document.createTextNode(""),
                dom2.childNodes[i]
              );
            } else if (textWasBlank) {
              dom2.prepend(document.createTextNode(""));
            } else {
              i = i - 1;
            }
            break;
          }
        }
        const main2 = dom2.childNodes[i];
        state3.units[ptr] = {
          // if we've done ssr for a text node, it will be a span,
          // so we want to get the child node
          main: main2,
          pos: a.pos,
          parent: a.parent,
          scope: a.scope,
          dynFamily: a.dynFamily
        };
        main2.$dekuId = ptr;
        return true;
      }
      return false;
    })();
    if (!iRan) {
      const main2 = document.createTextNode("");
      state3.units[ptr] = {
        main: main2,
        parent: a.parent,
        scope: a.scope,
        pos: a.pos,
        dynFamily: a.dynFamily
      };
      main2.$dekuId = ptr;
    }
  };
  function makeFFIDOMSnapshot() {
    return {
      units: {},
      scopes: {},
      allBeacons: {}
    };
  }
  var setProp_ = (tryHydration) => (a) => (state3) => () => {
    if (state3.units[a.id]) {
      var ptr = a.id;
      var avv = a.value;
      if (state3.hydrating && tryHydration && !state3.units[ptr] && (dom = document.documentElement.querySelector(`[data-deku-ssr="${ptr}"]`))) {
        state3.units[ptr] = {
          listeners: {},
          parent: a.parent,
          scope: a.scope,
          main: dom
        };
        if (!state3.scopes[a.scope]) {
          state3.scopes[a.scope] = [];
        }
        state3.scopes[a.scope].push(ptr);
      }
      if (state3.units[ptr].main.tagName === "INPUT" && a.key === "value") {
        state3.units[ptr].main.value = avv;
      } else if (state3.units[ptr].main.tagName === "TEXTAREA" && a.key === "value") {
        state3.units[ptr].main.value = avv;
      } else if (state3.units[ptr].main.tagName === "INPUT" && a.key === "checked") {
        state3.units[ptr].main.checked = avv === "true";
      } else if (a.key === "disabled") {
        state3.units[ptr].main.disabled = avv === "true";
      } else {
        state3.units[ptr].main.setAttribute(a.key, avv);
      }
    }
  };
  var setCb_ = (tryHydration) => (a) => (state3) => () => {
    if (state3.units[a.id]) {
      var ptr = a.id;
      var avv = a.value;
      if (state3.hydrating && tryHydration && !state3.units[ptr] && (dom = document.documentElement.querySelector(`[data-deku-ssr="${ptr}"]`))) {
        state3.units[ptr] = {
          listeners: {},
          parent: a.parent,
          scope: a.scope,
          main: dom
        };
        if (!state3.scopes[a.scope]) {
          state3.scopes[a.scope] = [];
        }
        state3.scopes[a.scope].push(ptr);
      }
      if (a.key === "@self@") {
        avv(state3.units[ptr].main)();
      } else {
        if (state3.units[ptr].listeners[a.key]) {
          state3.units[ptr].main.removeEventListener(
            a.key,
            state3.units[ptr].listeners[a.key]
          );
        }
        var el = (e) => avv(e)();
        state3.units[ptr].main.addEventListener(a.key, el);
        state3.units[ptr].listeners[a.key] = el;
      }
    }
  };
  var unsetAttribute_ = (tryHydration) => (a) => (state3) => () => {
    if (state3.units[a.id]) {
      var ptr = a.id;
      if (state3.hydrating && tryHydration && !state3.units[ptr] && (dom = document.documentElement.querySelector(`[data-deku-ssr="${ptr}"]`))) {
        state3.units[ptr] = {
          listeners: {},
          parent: a.parent,
          scope: a.scope,
          main: dom
        };
        if (!state3.scopes[a.scope]) {
          state3.scopes[a.scope] = [];
        }
        state3.scopes[a.scope].push(ptr);
      }
      state3.units[ptr].main.removeAttribute(a.key);
    }
  };
  var setText_ = (a) => (state3) => () => {
    if (state3.units[a.id]) {
      var ptr = a.id;
      state3.units[ptr].main.nodeValue = a.text;
    }
  };
  var makePursx_ = (runOnJust2) => (tryHydration) => (maybe2) => (a) => (state3) => () => {
    var dom2;
    var tmp;
    var ptr = a.id;
    var html = a.html;
    var dynFamily = a.dynFamily;
    var verb = a.verb;
    var cache = a.cache;
    var parent2 = a.parent;
    var scope2 = a.scope;
    var pxScope = a.pxScope;
    const iRan = runOnJust2(a.parent)(() => () => {
      if (state3.hydrating && tryHydration && // hack
      (dom2 = document.documentElement.querySelector(
        `[data-deku-ssr="${ptr}"]`
      ))) {
        state3.units[ptr] = {
          listeners: {},
          pos: a.pos,
          scope: scope2,
          parent: parent2,
          main: dom2,
          dynFamily
        };
        dom2.$dekuId = ptr;
        return true;
      }
      return false;
    })();
    if (!iRan) {
      const entries = Object.entries(cache);
      for (var i = 0; i < entries.length; i++) {
        const key5 = entries[i][0];
        if (entries[i][1] === true) {
          html = html.replace(
            verb + key5 + verb,
            'data-deku-attr-internal="' + key5 + '"'
          );
        } else {
          html = html.replace(
            verb + key5 + verb,
            '<span style="display:contents;" data-deku-elt-internal="' + key5 + '"></span>'
          );
        }
      }
      tmp = document.createElement("div");
      tmp.innerHTML = html.trim();
      state3.units[ptr] = {
        listeners: {},
        pos: a.pos,
        scope: scope2,
        dynFamily,
        parent: parent2,
        main: tmp.firstChild
      };
      tmp.firstChild.$dekuId = ptr;
    }
    if (!state3.scopes[scope2]) {
      state3.scopes[scope2] = [];
    }
    state3.scopes[scope2].push(ptr);
    if (!tmp) {
      tmp = dom2;
    }
    tmp.querySelectorAll("[data-deku-attr-internal]").forEach(function(e) {
      var key5 = e.getAttribute("data-deku-attr-internal");
      const namespacedKey = key5 + "@!%" + pxScope;
      state3.units[namespacedKey] = {
        listeners: {},
        main: e,
        scope: scope2
      };
      state3.scopes[scope2].push(namespacedKey);
    });
    tmp.querySelectorAll("[data-deku-elt-internal]").forEach(function(e) {
      var key5 = e.getAttribute("data-deku-elt-internal");
      const namespacedKey = key5 + "@!%" + pxScope;
      state3.units[key5 + "@!%" + pxScope] = {
        listeners: {},
        main: e,
        scope: scope2
      };
      state3.scopes[scope2].push(namespacedKey);
    });
    if (!iRan) {
      state3.units[ptr].main.remove();
    }
  };
  var makeRoot_ = (a) => (state3) => () => {
    var ptr = a.id;
    state3.units[ptr] = {
      main: a.root
    };
    a.root.$dekuId = ptr;
  };
  var giveNewParent_ = (just) => (runOnJust2) => (b) => (state3) => () => {
    const insertAt3 = (ptr, parent2, node) => {
      if (state3.units[ptr].startBeacon) {
        var x2 = state3.units[ptr].startBeacon;
        var y2 = x2.nextSibling;
        state3.units[parent2].main.insertBefore(x2, node);
        x2 = y2;
        while (x2 && x2 !== state3.units[ptr].endBeacon) {
          y2 = x2.nextSibling;
          state3.units[parent2].main.insertBefore(x2, node);
          x2 = y2;
        }
      } else {
        state3.units[parent2].main.insertBefore(state3.units[ptr].main, node);
      }
    };
    const runMe = [];
    runMe.push(b);
    for (var z = 0; z < runMe.length; z++) {
      const a = runMe[z];
      const ptr = a.id;
      const parent2 = a.parent;
      state3.units[ptr].containingScope = a.scope;
      var aPos = void 0;
      runOnJust2(a.pos)((myPos) => () => {
        aPos = myPos;
        return true;
      })();
      if (aPos === void 0) {
        aPos = Number.MAX_VALUE;
      }
      const nodes = state3.units[parent2].main.childNodes;
      var i = 0;
      var didInsert = false;
      var pos = 0;
      while (i < nodes.length) {
        var dkid;
        if (dkid = nodes[i].$dekuId) {
          const insertedBeforeEndBeacon = runOnJust2(a.dynFamily)((df) => () => {
            if (didInsert) {
              return false;
            }
            if (state3.units[dkid].endBeacon === nodes[i] && df === dkid) {
              state3.units[ptr].pos = just(pos);
              insertAt3(ptr, parent2, nodes[i]);
              return true;
            }
            return false;
          })();
          if (insertedBeforeEndBeacon) {
            didInsert = true;
            break;
          }
          if (state3.units[dkid].dynFamily !== a.dynFamily) {
            i++;
            continue;
          }
          if (didInsert) {
            i++;
            continue;
          }
          if (pos === aPos) {
            insertAt3(ptr, parent2, nodes[i]);
            pos++;
            didInsert = true;
          } else if (state3.units[dkid].endBeacon !== nodes[i]) {
            state3.units[dkid].pos = just(pos);
            pos++;
          }
        }
        i++;
      }
      if (didInsert) {
        return;
      }
      if (state3.units[ptr].main) {
        state3.units[parent2].main.appendChild(state3.units[ptr].main);
      } else {
        var x = state3.units[ptr].startBeacon;
        var y = x.nextSibling;
        state3.units[parent2].main.appendChild(x);
        x = y;
        while (x && x !== state3.units[ptr].endBeacon) {
          y = x.nextSibling;
          state3.units[parent2].main.appendChild(x);
          x = y;
        }
      }
    }
  };
  var disconnectElement_ = (a) => (state3) => () => {
    if (state3.units[a.id]) {
      var ptr = a.id;
      if (state3.units[ptr].containingScope && !a.scopeEq(state3.units[ptr].containingScope)(a.scope)) {
        return;
      }
      if (state3.units[ptr].main) {
        state3.units[ptr].main.remove();
      } else {
        const dummy = document.createElement("div");
        var x = state3.units[ptr].startBeacon;
        var y = x.nextSibling;
        dummy.appendChild(x);
        x = y;
        while (x && x !== state3.units[ptr].endBeacon) {
          y = x.nextSibling;
          dummy.appendChild(x);
          x = y;
        }
        if (x === state3.units[ptr].endBeacon) {
          dummy.appendChild(x);
        }
      }
    }
  };
  var stateHasKey = (id2) => (state3) => () => {
    return state3.units[id2] !== void 0;
  };
  var deleteFromCache_ = (a) => (state3) => () => {
    if (state3.units[a.id]) {
      if (state3.units[a.id].unsubscribe) {
        state3.units[a.id].unsubscribe();
      }
      delete state3.units[a.id];
    }
  };
  var removeDynBeacon_ = deleteFromCache_;

  // output/Data.String.Utils/foreign.js
  function includesImpl(searchString, str) {
    return str.includes(searchString);
  }

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str) {
      return str.codePointAt(0);
    } : fallback;
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str) {
          return Array.from(str, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n) {
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };
  var toNumber = function(n) {
    return n;
  };
  var toStringAs = function(radix) {
    return function(i) {
      return i.toString(radix);
    };
  };

  // output/Data.Number/foreign.js
  var isFiniteImpl = isFinite;
  var abs2 = Math.abs;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var remainder = function(n) {
    return function(m) {
      return n % m;
    };
  };
  var round = Math.round;

  // output/Data.Int/index.js
  var top2 = /* @__PURE__ */ top(boundedInt);
  var bottom2 = /* @__PURE__ */ bottom(boundedInt);
  var hexadecimal = 16;
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();
  var unsafeClamp = function(x) {
    if (!isFiniteImpl(x)) {
      return 0;
    }
    ;
    if (x >= toNumber(top2)) {
      return top2;
    }
    ;
    if (x <= toNumber(bottom2)) {
      return bottom2;
    }
    ;
    if (otherwise) {
      return fromMaybe(0)(fromNumber(x));
    }
    ;
    throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
  };
  var round2 = function($37) {
    return unsafeClamp(round($37));
  };
  var floor2 = function($39) {
    return unsafeClamp(floor($39));
  };
  var ceil2 = function($40) {
    return unsafeClamp(ceil($40));
  };

  // output/Data.String.CodeUnits/foreign.js
  var length4 = function(s) {
    return s.length;
  };
  var drop2 = function(n) {
    return function(s) {
      return s.substring(n);
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function(i) {
    return function(s) {
      if (i >= 0 && i < s.length)
        return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output/Data.String.Common/foreign.js
  var joinWith = function(s) {
    return function(xs) {
      return xs.join(s);
    };
  };

  // output/Data.String.CodePoints/index.js
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map15 = /* @__PURE__ */ map(functorMaybe);
  var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
  var unsurrogate = function(lead) {
    return function(trail) {
      return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
    };
  };
  var isTrail = function(cu) {
    return 56320 <= cu && cu <= 57343;
  };
  var isLead = function(cu) {
    return 55296 <= cu && cu <= 56319;
  };
  var uncons2 = function(s) {
    var v = length4(s);
    if (v === 0) {
      return Nothing.value;
    }
    ;
    if (v === 1) {
      return new Just({
        head: fromEnum2(charAt(0)(s)),
        tail: ""
      });
    }
    ;
    var cu1 = fromEnum2(charAt(1)(s));
    var cu0 = fromEnum2(charAt(0)(s));
    var $43 = isLead(cu0) && isTrail(cu1);
    if ($43) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop2(2)(s)
      });
    }
    ;
    return new Just({
      head: cu0,
      tail: drop2(1)(s)
    });
  };
  var unconsButWithTuple = function(s) {
    return map15(function(v) {
      return new Tuple(v.head, v.tail);
    })(uncons2(s));
  };
  var toCodePointArrayFallback = function(s) {
    return unfoldr2(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function(s) {
    var cu0 = fromEnum2(charAt(0)(s));
    var $47 = isLead(cu0) && length4(s) > 1;
    if ($47) {
      var cu1 = fromEnum2(charAt(1)(s));
      var $48 = isTrail(cu1);
      if ($48) {
        return unsurrogate(cu0)(cu1);
      }
      ;
      return cu0;
    }
    ;
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length5 = function($74) {
    return length(toCodePointArray($74));
  };

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Data.String.Utils/index.js
  var includes = function(searchString) {
    return function(s) {
      return includesImpl(searchString, s);
    };
  };

  // output/Deku.Interpret/index.js
  var $$void8 = /* @__PURE__ */ $$void(functorST);
  var append7 = /* @__PURE__ */ append(semigroupArray);
  var pure9 = /* @__PURE__ */ pure(applicativeEffect);
  var mempty3 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidFn(/* @__PURE__ */ monoidST(monoidUnit)));
  var mempty1 = /* @__PURE__ */ mempty(monoidNut);
  var coerce4 = /* @__PURE__ */ coerce();
  var add2 = /* @__PURE__ */ add(semiringInt);
  var ordList2 = /* @__PURE__ */ ordList(ordInt);
  var monoidEndo2 = /* @__PURE__ */ monoidEndo(categoryFn);
  var foldSubmap2 = /* @__PURE__ */ foldSubmap(ordList2)(/* @__PURE__ */ monoidRecord()(/* @__PURE__ */ monoidRecordCons({
    reflectSymbol: function() {
      return "instructions";
    }
  })(monoidEndo2)()(/* @__PURE__ */ monoidRecordCons({
    reflectSymbol: function() {
      return "newMap";
    }
  })(monoidEndo2)()(monoidRecordNil))));
  var $$delete4 = /* @__PURE__ */ $$delete(ordList2);
  var discard2 = /* @__PURE__ */ discard(discardUnit);
  var unwrap3 = /* @__PURE__ */ unwrap();
  var join5 = /* @__PURE__ */ join(bindArray);
  var alter2 = /* @__PURE__ */ alter(ordList2);
  var liftST5 = /* @__PURE__ */ liftST(monadSTEffect);
  var applySecond3 = /* @__PURE__ */ applySecond(applyFn);
  var liftST12 = /* @__PURE__ */ liftST(monadSTST);
  var sample5 = /* @__PURE__ */ sample(/* @__PURE__ */ pollable(eventIsEvent));
  var identity9 = /* @__PURE__ */ identity(categoryFn);
  var for_7 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var runOnJust = function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return v1(v.value0);
      }
      ;
      return pure9(false);
    };
  };
  var sendToPos2 = function(a) {
    return function(state3) {
      return function __do5() {
        var scope2 = getScope(a.id)(state3)();
        var parent2 = getParent(a.id)(state3)();
        var dynFamily = getDynFamily(a.id)(state3)();
        var newA = {
          scope: scope2,
          parent: parent2,
          dynFamily,
          id: a.id,
          deferralPath: Nil.value,
          pos: new Just(a.pos),
          ez: false,
          raiseId: mempty3,
          ctor: /* @__PURE__ */ function(v) {
            return v;
          }(mempty1)
        };
        return coerce4(giveNewParent_(Just.create)(runOnJust)(newA))(state3)();
      };
    };
  };
  var forcePayloadE = function(dictFunctor) {
    var void12 = $$void(dictFunctor);
    return function(dictMonadST) {
      var Monad0 = dictMonadST.Monad0();
      var Bind1 = Monad0.Bind1();
      var bind22 = bind(Bind1);
      var liftST22 = liftST(dictMonadST);
      var discard32 = discard2(Bind1);
      var for_13 = for_(Monad0.Applicative0())(foldableArray);
      return function(deferredCache) {
        return function(executor) {
          return function(l) {
            var fn = function(v) {
              return bind22(liftST22(read(deferredCache)))(function(o) {
                var tail2 = function(v12) {
                  if (v12 instanceof Cons && v12.value1 instanceof Nil) {
                    return new Cons(v12.value0 + 1 | 0, Nil.value);
                  }
                  ;
                  if (v12 instanceof Cons) {
                    return new Cons(v12.value0, tail2(v12.value1));
                  }
                  ;
                  return v12;
                };
                var rightBound = new Just(tail2(l));
                var leftBound = new Just(l);
                var v1 = flip(foldSubmap2(leftBound)(rightBound))(o)(function(k) {
                  return function(v2) {
                    return {
                      newMap: $$delete4(k),
                      instructions: cons(v2)
                    };
                  };
                });
                return discard32(void12(liftST22(modify(unwrap3(v1.newMap))(deferredCache))))(function() {
                  return for_13(join5(unwrap3(v1.instructions)([])))(executor);
                });
              });
            };
            return fn;
          };
        };
      };
    };
  };
  var forcePayloadE2 = /* @__PURE__ */ forcePayloadE(functorEffect)(monadSTEffect);
  var deferPayloadE = function(dictFunctor) {
    var void12 = $$void(dictFunctor);
    return function(dictMonadST) {
      var liftST22 = liftST(dictMonadST);
      return function(deferredCache) {
        return function(l) {
          return function(p) {
            return function(v) {
              return void12(liftST22(modify(flip(alter2)(l)(function(v1) {
                if (v1 instanceof Nothing) {
                  return new Just([p]);
                }
                ;
                if (v1 instanceof Just) {
                  return new Just(append7(v1.value0)([p]));
                }
                ;
                throw new Error("Failed pattern match at Deku.Interpret (line 395, column 24 - line 397, column 36): " + [v1.constructor.name]);
              }))(deferredCache)));
            };
          };
        };
      };
    };
  };
  var deferPayloadE2 = /* @__PURE__ */ deferPayloadE(functorEffect)(monadSTEffect);
  var __internalDekuFlatten3 = function(c) {
    return function(a) {
      return function(b) {
        return flatten(flattenArgs)(coerce4(c))(a)(b);
      };
    };
  };
  var giveNewParentOrReconstruct = function(v) {
    return function(executor) {
      return function(just) {
        return function(roj) {
          return function(gnp) {
            return function(ffi) {
              var needsFreshNut = function __do5() {
                var myId = liftST5(newSTRef(Nothing.value))();
                var newRaiseId = applySecond3(gnp.raiseId)(function() {
                  var $130 = flip(write)(myId);
                  return function($131) {
                    return $$void8(liftST12($130(Just.create($131))));
                  };
                }());
                var ohBehave = __internalDekuFlatten3(gnp.ctor)({
                  dynFamily: gnp.dynFamily,
                  ez: gnp.ez,
                  deferralPath: gnp.deferralPath,
                  parent: new Just(gnp.parent),
                  pos: gnp.pos,
                  raiseId: newRaiseId,
                  scope: gnp.scope
                })(v);
                var pump = liftST5(create)();
                var unsubscribe = liftST5(subscribe(sample5(ohBehave)(pump.event))(executor))();
                pump.push(identity9)();
                var fetchedId = liftST5(read(myId))();
                return for_7(fetchedId)(function($132) {
                  return executor(v.associateWithUnsubscribe(/* @__PURE__ */ function(v1) {
                    return {
                      unsubscribe,
                      id: v1
                    };
                  }($132)));
                })();
              };
              var hasIdAndInScope = giveNewParent_(just)(roj)(gnp)(ffi);
              return function __do5() {
                var hasId = stateHasKey(gnp.id)(ffi)();
                if (hasId) {
                  var scope2 = getScope(gnp.id)(ffi)();
                  if (scope2 instanceof Global) {
                    return hasIdAndInScope();
                  }
                  ;
                  if (scope2 instanceof Local && gnp.scope instanceof Local) {
                    var $126 = includes(scope2.value0)(gnp.scope.value0);
                    if ($126) {
                      return hasIdAndInScope();
                    }
                    ;
                    return needsFreshNut();
                  }
                  ;
                  return needsFreshNut();
                }
                ;
                return needsFreshNut();
              };
            };
          };
        };
      };
    };
  };
  var fullDOMInterpret = function(seed) {
    return function(deferredCache) {
      return function(executor) {
        var l = {
          ids: function __do5() {
            var s = read(seed)();
            $$void8(modify(add2(1))(seed))();
            return s;
          },
          associateWithUnsubscribe: associateWithUnsubscribe_,
          deferPayload: deferPayloadE2(deferredCache),
          forcePayload: forcePayloadE2(deferredCache)(executor),
          makeElement: makeElement_(runOnJust)(false),
          makeDynBeacon: makeDynBeacon_(runOnJust)(false),
          attributeParent: attributeParent_(runOnJust),
          makeRoot: makeRoot_,
          makeText: makeText_(runOnJust)(false)(maybe(unit)),
          makePursx: makePursx_(runOnJust)(false)(maybe(unit)),
          setProp: setProp_(false),
          setCb: setCb_(false),
          unsetAttribute: unsetAttribute_(false),
          setText: setText_,
          sendToPos: sendToPos2,
          removeDynBeacon: removeDynBeacon_,
          deleteFromCache: deleteFromCache_,
          giveNewParent: function(gnp) {
            return giveNewParentOrReconstruct(l)(executor)(Just.create)(runOnJust)(gnp);
          },
          disconnectElement: disconnectElement_
        };
        return l;
      };
    };
  };

  // output/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }

  // output/Effect.Exception/index.js
  var $$throw = function($4) {
    return throwException(error($4));
  };

  // output/Control.Monad.Error.Class/index.js
  var throwError = function(dict) {
    return dict.throwError;
  };
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map29 = map(Monad0.Bind1().Apply0().Functor0());
    var pure15 = pure(Monad0.Applicative0());
    return function(a) {
      return catchError1(map29(Right.create)(a))(function($52) {
        return pure15(Left.create($52));
      });
    };
  };

  // output/Control.Monad.Writer.Class/index.js
  var tell = function(dict) {
    return dict.tell;
  };

  // output/Effect.Class/index.js
  var monadEffectEffect = {
    liftEffect: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadEffect;
    }
  };
  var liftEffect = function(dict) {
    return dict.liftEffect;
  };

  // output/Deku.Toplevel/index.js
  var bind3 = /* @__PURE__ */ bind(bindEffect);
  var liftST6 = /* @__PURE__ */ liftST(monadSTEffect);
  var sample_3 = /* @__PURE__ */ sample_(/* @__PURE__ */ pollable(eventIsEvent))(functorEvent)(functorEvent);
  var for_8 = /* @__PURE__ */ for_(applicativeEffect)(foldableMap);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
  var map16 = /* @__PURE__ */ map(functorMaybe);
  var $$void9 = /* @__PURE__ */ $$void(functorEffect);
  var runInElement$prime = function(elt) {
    return function(eee) {
      return function __do5() {
        var ffi = makeFFIDOMSnapshot();
        var seed = liftST6(newSTRef(0))();
        var cache = liftST6(newSTRef(empty2))();
        var executor = function(f) {
          return f(ffi);
        };
        var bhv = deku(elt)(eee)(fullDOMInterpret(seed)(cache)(executor));
        var bang = liftST6(create)();
        var u = liftST6(subscribe(sample_3(bhv)(bang.event))(executor))();
        bang.push(unit)();
        return function __do6() {
          var o = liftST6(read(cache))();
          for_8(o)(traverse_2(executor))();
          liftST6(u)();
          return ffi;
        };
      };
    };
  };
  var runInBody$prime = function(eee) {
    return function __do5() {
      var b$prime = bind3(bind3(windowImpl)(document2))(body)();
      return maybe(throwException(error("Could not find element")))(flip(runInElement$prime)(eee))(map16(toElement)(b$prime))();
    };
  };
  var runInBody = function(a) {
    return $$void9(runInBody$prime(a));
  };

  // output/CSS.String/index.js
  var fromString = function(dict) {
    return dict.fromString;
  };

  // output/Color/index.js
  var clamp2 = /* @__PURE__ */ clamp(ordInt);
  var max6 = /* @__PURE__ */ max(ordInt);
  var min5 = /* @__PURE__ */ min(ordInt);
  var clamp1 = /* @__PURE__ */ clamp(ordNumber);
  var show5 = /* @__PURE__ */ show(showNumber);
  var HSLA = /* @__PURE__ */ function() {
    function HSLA2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    HSLA2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new HSLA2(value0, value1, value22, value32);
          };
        };
      };
    };
    return HSLA2;
  }();
  var modPos = function(x) {
    return function(y) {
      return remainder(remainder(x)(y) + y)(y);
    };
  };
  var rgba = function(red$prime) {
    return function(green$prime) {
      return function(blue$prime) {
        return function(alpha) {
          var red = clamp2(0)(255)(red$prime);
          var r = toNumber(red) / 255;
          var green = clamp2(0)(255)(green$prime);
          var g = toNumber(green) / 255;
          var blue = clamp2(0)(255)(blue$prime);
          var maxChroma = max6(max6(red)(green))(blue);
          var minChroma = min5(min5(red)(green))(blue);
          var chroma = maxChroma - minChroma | 0;
          var chroma$prime = toNumber(chroma) / 255;
          var lightness = toNumber(maxChroma + minChroma | 0) / (255 * 2);
          var saturation = function() {
            if (chroma === 0) {
              return 0;
            }
            ;
            if (otherwise) {
              return chroma$prime / (1 - abs2(2 * lightness - 1));
            }
            ;
            throw new Error("Failed pattern match at Color (line 160, column 3 - line 162, column 64): ");
          }();
          var b = toNumber(blue) / 255;
          var hue$prime = function(v) {
            if (v === 0) {
              return 0;
            }
            ;
            if (maxChroma === red) {
              return modPos((g - b) / chroma$prime)(6);
            }
            ;
            if (maxChroma === green) {
              return (b - r) / chroma$prime + 2;
            }
            ;
            if (otherwise) {
              return (r - g) / chroma$prime + 4;
            }
            ;
            throw new Error("Failed pattern match at Color (line 150, column 3 - line 150, column 15): " + [v.constructor.name]);
          };
          var hue = 60 * hue$prime(chroma);
          return new HSLA(hue, saturation, lightness, alpha);
        };
      };
    };
  };
  var rgba$prime = function(r) {
    return function(g) {
      return function(b) {
        return function(a) {
          return rgba(round2(r * 255))(round2(g * 255))(round2(b * 255))(a);
        };
      };
    };
  };
  var rgb$prime = function(r) {
    return function(g) {
      return function(b) {
        return rgba$prime(r)(g)(b)(1);
      };
    };
  };
  var hsla = function(h) {
    return function(s) {
      return function(l) {
        return function(a) {
          var s$prime = clamp1(0)(1)(s);
          var l$prime = clamp1(0)(1)(l);
          var a$prime = clamp1(0)(1)(a);
          return new HSLA(h, s$prime, l$prime, a$prime);
        };
      };
    };
  };
  var hsl = function(h) {
    return function(s) {
      return function(l) {
        return hsla(h)(s)(l)(1);
      };
    };
  };
  var white = /* @__PURE__ */ hsl(0)(0)(1);
  var graytone = function(l) {
    return hsl(0)(0)(l);
  };
  var cssStringHSLA = function(v) {
    var toString = function(n) {
      return show5(toNumber(round2(100 * n)) / 100);
    };
    var saturation = toString(v.value1 * 100) + "%";
    var lightness = toString(v.value2 * 100) + "%";
    var hue = toString(v.value0);
    var alpha = show5(v.value3);
    var $118 = v.value3 === 1;
    if ($118) {
      return "hsl(" + (hue + (", " + (saturation + (", " + (lightness + ")")))));
    }
    ;
    return "hsla(" + (hue + (", " + (saturation + (", " + (lightness + (", " + (alpha + ")")))))));
  };
  var clipHue = function(v) {
    var $124 = 360 === v;
    if ($124) {
      return v;
    }
    ;
    return modPos(v)(360);
  };
  var toRGBA$prime = function(v) {
    var h$prime = clipHue(v.value0) / 60;
    var chr = (1 - abs2(2 * v.value2 - 1)) * v.value1;
    var m = v.value2 - chr / 2;
    var x = chr * (1 - abs2(remainder(h$prime)(2) - 1));
    var col = function() {
      if (h$prime < 1) {
        return {
          r: chr,
          g: x,
          b: 0
        };
      }
      ;
      if (1 <= h$prime && h$prime < 2) {
        return {
          r: x,
          g: chr,
          b: 0
        };
      }
      ;
      if (2 <= h$prime && h$prime < 3) {
        return {
          r: 0,
          g: chr,
          b: x
        };
      }
      ;
      if (3 <= h$prime && h$prime < 4) {
        return {
          r: 0,
          g: x,
          b: chr
        };
      }
      ;
      if (4 <= h$prime && h$prime < 5) {
        return {
          r: x,
          g: 0,
          b: chr
        };
      }
      ;
      if (otherwise) {
        return {
          r: chr,
          g: 0,
          b: x
        };
      }
      ;
      throw new Error("Failed pattern match at Color (line 356, column 3 - line 362, column 43): ");
    }();
    return {
      r: col.r + m,
      g: col.g + m,
      b: col.b + m,
      a: v.value3
    };
  };
  var toRGBA = function(col) {
    var c = toRGBA$prime(col);
    var g = round2(255 * c.g);
    var r = round2(255 * c.r);
    var b = round2(255 * c.b);
    return {
      r,
      g,
      b,
      a: c.a
    };
  };
  var toHexString = function(color2) {
    var toHex = function(num) {
      var repr = toStringAs(hexadecimal)(num);
      var $152 = length5(repr) === 1;
      if ($152) {
        return "0" + repr;
      }
      ;
      return repr;
    };
    var c = toRGBA(color2);
    var alpha = function() {
      if (c.a === 1) {
        return "";
      }
      ;
      if (otherwise) {
        return toHex(round2(255 * c.a));
      }
      ;
      throw new Error("Failed pattern match at Color (line 429, column 3 - line 431, column 46): ");
    }();
    return "#" + (toHex(c.r) + (toHex(c.g) + (toHex(c.b) + alpha)));
  };
  var black = /* @__PURE__ */ hsl(0)(0)(0);

  // output/Data.Profunctor.Strong/index.js
  var strongFn = {
    first: function(a2b) {
      return function(v) {
        return new Tuple(a2b(v.value0), v.value1);
      };
    },
    second: /* @__PURE__ */ map(functorTuple),
    Profunctor0: function() {
      return profunctorFn;
    }
  };
  var second = function(dict) {
    return dict.second;
  };

  // output/CSS.Property/index.js
  var map17 = /* @__PURE__ */ map(functorArray);
  var second2 = /* @__PURE__ */ second(strongFn);
  var append13 = /* @__PURE__ */ append(semigroupArray);
  var lookup3 = /* @__PURE__ */ lookup(foldableArray)(eqString);
  var Prefixed = /* @__PURE__ */ function() {
    function Prefixed2(value0) {
      this.value0 = value0;
    }
    ;
    Prefixed2.create = function(value0) {
      return new Prefixed2(value0);
    };
    return Prefixed2;
  }();
  var Plain = /* @__PURE__ */ function() {
    function Plain2(value0) {
      this.value0 = value0;
    }
    ;
    Plain2.create = function(value0) {
      return new Plain2(value0);
    };
    return Plain2;
  }();
  var Value = function(x) {
    return x;
  };
  var Key = function(x) {
    return x;
  };
  var value12 = function(dict) {
    return dict.value;
  };
  var semigroupPrefixed = {
    append: function(v) {
      return function(v1) {
        if (v instanceof Plain && v1 instanceof Plain) {
          return new Plain(v.value0 + v1.value0);
        }
        ;
        if (v instanceof Plain && v1 instanceof Prefixed) {
          return new Prefixed(map17(second2(function(v2) {
            return v.value0 + v2;
          }))(v1.value0));
        }
        ;
        if (v instanceof Prefixed && v1 instanceof Plain) {
          return new Prefixed(map17(second2(function(v2) {
            return v1.value0 + v2;
          }))(v.value0));
        }
        ;
        if (v instanceof Prefixed && v1 instanceof Prefixed) {
          return new Prefixed(append13(v.value0)(v1.value0));
        }
        ;
        throw new Error("Failed pattern match at CSS.Property (line 23, column 1 - line 27, column 59): " + [v.constructor.name, v1.constructor.name]);
      };
    }
  };
  var append23 = /* @__PURE__ */ append(semigroupPrefixed);
  var semigroupValue = {
    append: function(v) {
      return function(v1) {
        return append23(v)(v1);
      };
    }
  };
  var append32 = /* @__PURE__ */ append(semigroupValue);
  var plain = function(v) {
    if (v instanceof Prefixed) {
      return fromMaybe("")(lookup3("")(v.value0));
    }
    ;
    if (v instanceof Plain) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at CSS.Property (line 32, column 1 - line 32, column 28): " + [v.constructor.name]);
  };
  var isStringPrefixed = /* @__PURE__ */ function() {
    return {
      fromString: Plain.create
    };
  }();
  var fromString2 = /* @__PURE__ */ fromString(isStringPrefixed);
  var isStringValue = {
    fromString: function($141) {
      return Value(fromString2($141));
    }
  };
  var fromString1 = /* @__PURE__ */ fromString(isStringValue);
  var valColor = {
    value: function($144) {
      return fromString1(cssStringHSLA($144));
    }
  };
  var valNumber = {
    value: /* @__PURE__ */ function() {
      var $149 = show(showNumber);
      return function($150) {
        return fromString1($149($150));
      };
    }()
  };
  var valString = {
    value: fromString1
  };
  var valTuple = function(dictVal) {
    var value1 = value12(dictVal);
    return function(dictVal1) {
      var value22 = value12(dictVal1);
      return {
        value: function(v) {
          return append32(value1(v.value0))(append32(fromString1(" "))(value22(v.value1)));
        }
      };
    };
  };
  var isStringKey = {
    fromString: function($151) {
      return Key(fromString2($151));
    }
  };
  var cast = function(v) {
    return v;
  };

  // output/CSS.Common/index.js
  var browsers = /* @__PURE__ */ function() {
    return new Prefixed([new Tuple("-webkit-", ""), new Tuple("-moz-", ""), new Tuple("-ms-", ""), new Tuple("-o-", ""), new Tuple("", "")]);
  }();

  // output/Data.Exists/index.js
  var runExists = unsafeCoerce;

  // output/CSS.Size/index.js
  var append8 = /* @__PURE__ */ append(semigroupValue);
  var value13 = /* @__PURE__ */ value12(valNumber);
  var fromString3 = /* @__PURE__ */ fromString(isStringValue);
  var show6 = /* @__PURE__ */ show(showNumber);
  var append24 = /* @__PURE__ */ append(semigroupPrefixed);
  var BasicSize = /* @__PURE__ */ function() {
    function BasicSize2(value0) {
      this.value0 = value0;
    }
    ;
    BasicSize2.create = function(value0) {
      return new BasicSize2(value0);
    };
    return BasicSize2;
  }();
  var SumSize = /* @__PURE__ */ function() {
    function SumSize2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SumSize2.create = function(value0) {
      return function(value1) {
        return new SumSize2(value0, value1);
      };
    };
    return SumSize2;
  }();
  var DiffSize = /* @__PURE__ */ function() {
    function DiffSize2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    DiffSize2.create = function(value0) {
      return function(value1) {
        return new DiffSize2(value0, value1);
      };
    };
    return DiffSize2;
  }();
  var MultSize = /* @__PURE__ */ function() {
    function MultSize2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    MultSize2.create = function(value0) {
      return function(value1) {
        return new MultSize2(value0, value1);
      };
    };
    return MultSize2;
  }();
  var DivSize = /* @__PURE__ */ function() {
    function DivSize2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    DivSize2.create = function(value0) {
      return function(value1) {
        return new DivSize2(value0, value1);
      };
    };
    return DivSize2;
  }();
  var sizeToString = function(v) {
    if (v instanceof BasicSize) {
      return plain(v.value0);
    }
    ;
    if (v instanceof SumSize) {
      return runExists(function(a$prime) {
        return runExists(function(b$prime) {
          return "(" + (sizeToString(a$prime) + (" + " + (sizeToString(b$prime) + ")")));
        })(v.value1);
      })(v.value0);
    }
    ;
    if (v instanceof DiffSize) {
      return runExists(function(a$prime) {
        return runExists(function(b$prime) {
          return "(" + (sizeToString(a$prime) + (" - " + (sizeToString(b$prime) + ")")));
        })(v.value1);
      })(v.value0);
    }
    ;
    if (v instanceof MultSize) {
      return runExists(function(b$prime) {
        return "(" + (show6(v.value0) + (" * " + (sizeToString(b$prime) + ")")));
      })(v.value1);
    }
    ;
    if (v instanceof DivSize) {
      return runExists(function(b$prime) {
        return "(" + (sizeToString(b$prime) + (" / " + (show6(v.value0) + ")")));
      })(v.value1);
    }
    ;
    throw new Error("Failed pattern match at CSS.Size (line 29, column 1 - line 29, column 43): " + [v.constructor.name]);
  };
  var valSize = {
    value: function(v) {
      if (v instanceof BasicSize) {
        return v.value0;
      }
      ;
      return append24(browsers)(new Plain("calc" + sizeToString(v)));
    }
  };
  var px = function(i) {
    return new BasicSize(append8(value13(i))(fromString3("px")));
  };
  var pct = function(i) {
    return new BasicSize(append8(value13(i))(fromString3("%")));
  };

  // output/Control.Monad.Writer.Trans/index.js
  var WriterT = function(x) {
    return x;
  };
  var runWriterT = function(v) {
    return v;
  };
  var mapWriterT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorWriterT = function(dictFunctor) {
    var map29 = map(dictFunctor);
    return {
      map: function(f) {
        return mapWriterT(map29(function(v) {
          return new Tuple(f(v.value0), v.value1);
        }));
      }
    };
  };
  var applyWriterT = function(dictSemigroup) {
    var append9 = append(dictSemigroup);
    return function(dictApply) {
      var apply7 = apply(dictApply);
      var Functor0 = dictApply.Functor0();
      var map29 = map(Functor0);
      var functorWriterT1 = functorWriterT(Functor0);
      return {
        apply: function(v) {
          return function(v1) {
            var k = function(v3) {
              return function(v4) {
                return new Tuple(v3.value0(v4.value0), append9(v3.value1)(v4.value1));
              };
            };
            return apply7(map29(k)(v))(v1);
          };
        },
        Functor0: function() {
          return functorWriterT1;
        }
      };
    };
  };
  var bindWriterT = function(dictSemigroup) {
    var append9 = append(dictSemigroup);
    var applyWriterT1 = applyWriterT(dictSemigroup);
    return function(dictBind) {
      var bind9 = bind(dictBind);
      var Apply0 = dictBind.Apply0();
      var map29 = map(Apply0.Functor0());
      var applyWriterT2 = applyWriterT1(Apply0);
      return {
        bind: function(v) {
          return function(k) {
            return bind9(v)(function(v1) {
              var v2 = k(v1.value0);
              return map29(function(v3) {
                return new Tuple(v3.value0, append9(v1.value1)(v3.value1));
              })(v2);
            });
          };
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var applicativeWriterT = function(dictMonoid) {
    var mempty6 = mempty(dictMonoid);
    var applyWriterT1 = applyWriterT(dictMonoid.Semigroup0());
    return function(dictApplicative) {
      var pure15 = pure(dictApplicative);
      var applyWriterT2 = applyWriterT1(dictApplicative.Apply0());
      return {
        pure: function(a) {
          return pure15(new Tuple(a, mempty6));
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var monadWriterT = function(dictMonoid) {
    var applicativeWriterT1 = applicativeWriterT(dictMonoid);
    var bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return function(dictMonad) {
      var applicativeWriterT2 = applicativeWriterT1(dictMonad.Applicative0());
      var bindWriterT2 = bindWriterT1(dictMonad.Bind1());
      return {
        Applicative0: function() {
          return applicativeWriterT2;
        },
        Bind1: function() {
          return bindWriterT2;
        }
      };
    };
  };
  var monadTellWriterT = function(dictMonoid) {
    var Semigroup0 = dictMonoid.Semigroup0();
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonad) {
      var monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: function() {
          var $252 = pure(dictMonad.Applicative0());
          var $253 = Tuple.create(unit);
          return function($254) {
            return WriterT($252($253($254)));
          };
        }(),
        Semigroup0: function() {
          return Semigroup0;
        },
        Monad1: function() {
          return monadWriterT2;
        }
      };
    };
  };

  // output/Control.Monad.Writer/index.js
  var unwrap4 = /* @__PURE__ */ unwrap();
  var runWriter = function($5) {
    return unwrap4(runWriterT($5));
  };
  var execWriter = function(m) {
    return snd(runWriter(m));
  };

  // output/CSS.Stylesheet/index.js
  var map18 = /* @__PURE__ */ map(/* @__PURE__ */ functorWriterT(functorIdentity));
  var apply5 = /* @__PURE__ */ apply(/* @__PURE__ */ applyWriterT(semigroupArray)(applyIdentity));
  var bind4 = /* @__PURE__ */ bind(/* @__PURE__ */ bindWriterT(semigroupArray)(bindIdentity));
  var Property = /* @__PURE__ */ function() {
    function Property2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Property2.create = function(value0) {
      return function(value1) {
        return new Property2(value0, value1);
      };
    };
    return Property2;
  }();
  var S = function(x) {
    return x;
  };
  var runS = function(v) {
    return execWriter(v);
  };
  var rule = /* @__PURE__ */ function() {
    var $340 = tell(monadTellWriterT(monoidArray)(monadIdentity));
    return function($341) {
      return S($340(singleton2($341)));
    };
  }();
  var key = function(dictVal) {
    var value15 = value12(dictVal);
    return function(k) {
      return function(v) {
        return rule(new Property(cast(k), value15(v)));
      };
    };
  };
  var functorStyleM = {
    map: function(f) {
      return function(v) {
        return map18(f)(v);
      };
    }
  };
  var applyStyleM = {
    apply: function(v) {
      return function(v1) {
        return apply5(v)(v1);
      };
    },
    Functor0: function() {
      return functorStyleM;
    }
  };
  var bindStyleM = {
    bind: function(v) {
      return function(f) {
        return bind4(v)(function($346) {
          return /* @__PURE__ */ function(v1) {
            return v1;
          }(f($346));
        });
      };
    },
    Apply0: function() {
      return applyStyleM;
    }
  };

  // output/CSS.Border/index.js
  var fromString4 = /* @__PURE__ */ fromString(isStringValue);
  var fromString12 = /* @__PURE__ */ fromString(isStringKey);
  var valTuple2 = /* @__PURE__ */ valTuple(valSize);
  var valStroke = {
    value: function(v) {
      return v;
    }
  };
  var key3 = /* @__PURE__ */ key(/* @__PURE__ */ valTuple(valStroke)(/* @__PURE__ */ valTuple2(valColor)));
  var solid = /* @__PURE__ */ fromString4("solid");
  var border2 = function(a) {
    return function(b) {
      return function(c) {
        return key3(fromString12("border"))(new Tuple(a, new Tuple(b, c)));
      };
    };
  };

  // output/CSS.Display/index.js
  var fromString5 = /* @__PURE__ */ fromString(isStringKey);
  var fromString13 = /* @__PURE__ */ fromString(isStringValue);
  var zIndex = /* @__PURE__ */ function() {
    var $64 = key(valString)(fromString5("z-index"));
    var $65 = show(showInt);
    return function($66) {
      return $64($65($66));
    };
  }();
  var valPosition = {
    value: function(v) {
      return v;
    }
  };
  var relative = /* @__PURE__ */ fromString13("relative");
  var position2 = /* @__PURE__ */ key(valPosition)(/* @__PURE__ */ fromString5("position"));
  var absolute = /* @__PURE__ */ fromString13("absolute");

  // output/CSS.Geometry/index.js
  var key2 = /* @__PURE__ */ key(valSize);
  var fromString6 = /* @__PURE__ */ fromString(isStringKey);
  var width8 = /* @__PURE__ */ key2(/* @__PURE__ */ fromString6("width"));
  var height8 = /* @__PURE__ */ key2(/* @__PURE__ */ fromString6("height"));

  // output/Canvas/foreign.js
  var context2D = (canvasElement) => {
    return canvasElement.getContext("2d");
  };
  var clearRectImpl = (context) => (x) => (y) => (width10) => (height10) => () => {
    context.clearRect(x, y, width10, height10);
  };
  var setFillStyleImpl = (context) => (colorString) => () => {
    context.fillStyle = colorString;
  };
  var fillRectImpl = (context) => (x) => (y) => (width10) => (height10) => () => {
    context.fillRect(x, y, width10, height10);
  };
  var beginPath = (context) => () => {
    context.beginPath();
  };
  var moveTo2 = (context) => (x) => (y) => () => {
    context.moveTo(x, y);
  };
  var lineTo = (context) => (x) => (y) => () => {
    context.lineTo(x, y);
  };
  var stroke = (context) => () => {
    context.stroke();
  };
  var setWidth8 = (canvasElement) => (width10) => () => {
    canvasElement.width = width10;
  };
  var setHeight8 = (canvasElement) => (height10) => () => {
    canvasElement.height = height10;
  };

  // output/Canvas/index.js
  var setFillStyle = function(context) {
    return function(color2) {
      return setFillStyleImpl(context)(toHexString(color2));
    };
  };
  var fillRect = function(context) {
    return function(rectangle) {
      return fillRectImpl(context)(rectangle.x)(rectangle.y)(rectangle.width)(rectangle.height);
    };
  };
  var clearRect = function(context) {
    return function(rectangle) {
      return clearRectImpl(context)(rectangle.x)(rectangle.y)(rectangle.width)(rectangle.height);
    };
  };

  // output/Effect.Console/foreign.js
  var log2 = function(s) {
    return function() {
      console.log(s);
    };
  };

  // output/CSS.Render/index.js
  var map19 = /* @__PURE__ */ map(functorArray);
  var lookup4 = /* @__PURE__ */ lookup(foldableArray)(eqString);
  var collect$prime = function(v) {
    return function(v1) {
      if (v instanceof Plain && v1 instanceof Plain) {
        return [new Right(new Tuple(v.value0, v1.value0))];
      }
      ;
      if (v instanceof Prefixed && v1 instanceof Plain) {
        return map19(function(v3) {
          return new Right(new Tuple(v3.value0 + v3.value1, v1.value0));
        })(v.value0);
      }
      ;
      if (v instanceof Plain && v1 instanceof Prefixed) {
        return map19(function(v2) {
          return new Right(new Tuple(v.value0, v2.value0 + v2.value1));
        })(v1.value0);
      }
      ;
      if (v instanceof Prefixed && v1 instanceof Prefixed) {
        return map19(function(v2) {
          return maybe(new Left(v2.value0 + v2.value1))(function() {
            var $213 = Tuple.create(v2.value0 + v2.value1);
            return function($214) {
              return Right.create($213(function(v3) {
                return v2.value0 + v3;
              }($214)));
            };
          }())(lookup4(v2.value0)(v1.value0));
        })(v.value0);
      }
      ;
      throw new Error("Failed pattern match at CSS.Render (line 158, column 1 - line 158, column 80): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var collect = function(v) {
    return collect$prime(v.value0)(v.value1);
  };

  // output/Deku.CSS/index.js
  var filterMap3 = /* @__PURE__ */ filterMap(filterableArray);
  var bind5 = /* @__PURE__ */ bind(bindArray);
  var fromFoldable4 = /* @__PURE__ */ fromFoldable2(foldableArray);
  var render = /* @__PURE__ */ function() {
    var toString = function() {
      var $11 = joinWith("; ");
      var $12 = foldMap2(monoidArray)(function(key5) {
        return function(val) {
          return [key5 + (": " + val)];
        };
      });
      return function($13) {
        return $11($12($13));
      };
    }();
    var rights = filterMap3(hush);
    var property = function(v) {
      if (v instanceof Property) {
        return new Just(new Tuple(v.value0, v.value1));
      }
      ;
      return Nothing.value;
    };
    var rules = function(rs) {
      var properties = bind5(filterMap3(property)(rs))(function($14) {
        return rights(collect($14));
      });
      return fromFoldable4(properties);
    };
    return function($15) {
      return toString(rules(runS($15)));
    };
  }();

  // output/Deku.DOM/index.js
  var select3 = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("select");
  }();
  var option = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("option");
  }();
  var input = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("input");
  }();
  var div2 = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("div");
  }();
  var div_ = /* @__PURE__ */ div2([]);
  var canvas = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("canvas");
  }();
  var button = /* @__PURE__ */ function() {
    return elementify2(Nothing.value)("button");
  }();

  // output/Deku.DOM.Self/index.js
  var map20 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var pure10 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeAPoll(applyEvent));
  var self = /* @__PURE__ */ map20(function($51) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "@self@",
        value: v
      };
    }(cb$prime(cb($51))));
  });
  var self_ = function($52) {
    return self(pure10($52));
  };

  // output/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function() {
          throw error3;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left(error3);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left(error3))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size4 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size4 !== 0) {
          size4--;
          thunk = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb2) {
          var i, tmp;
          if (size4 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size4) % limit] = cb2;
          size4++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count2 = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count2--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count2++;
        },
        isEmpty: function() {
          return count2 === 0;
        },
        killAll: function(killError, cb2) {
          return function() {
            if (count2 === 0) {
              return cb2();
            }
            var killCount = 0;
            var kills = {};
            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function() {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb2();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count2 = 0;
            return function(error3) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step2 = aff;
      var fail2 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run3(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step2 = bhead(step2);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail2 = util.left(e);
                step2 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step2)) {
                status = RETURN;
                fail2 = step2;
                step2 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step2 = util.fromRight(step2);
              }
              break;
            case CONTINUE:
              switch (step2.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step2._2;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step2 = util.right(step2._1);
                  } else {
                    status = STEP_BIND;
                    step2 = step2._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step2 = runSync(util.left, util.right, step2._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step2 = runAsync(util.left, step2._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step2 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail2 = util.left(step2._1);
                  step2 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step2, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step2 = step2._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util, supervisor, step2._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step2._1) {
                    tmp.run();
                  }
                  step2 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step2 = sequential2(util, supervisor, step2._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step2 = interrupt || fail2 || step2;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail2) {
                      status = CONTINUE;
                      step2 = attempt._2(util.fromLeft(fail2));
                      fail2 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step2 = util.fromRight(step2);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail2 === null) {
                      result = util.fromRight(step2);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step2 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step2 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                    } else if (fail2) {
                      step2 = attempt._1.failed(util.fromLeft(fail2))(attempt._2);
                    } else {
                      step2 = attempt._1.completed(util.fromRight(step2))(attempt._2);
                    }
                    fail2 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                    status = CONTINUE;
                    step2 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step2 = attempt._1;
                    fail2 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step2));
                }
              }
              joins = null;
              if (interrupt && fail2) {
                setTimeout(function() {
                  throw util.fromLeft(fail2);
                }, 0);
              } else if (util.isLeft(step2) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util.fromLeft(step2);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join8) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join8.rethrow;
            join8.handler(step2)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join8;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb2) {
        return function() {
          if (status === COMPLETED) {
            cb2(util.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb2(util.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error3);
              status = COMPLETED;
              step2 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error3)), attempts, interrupt);
                }
                status = RETURN;
                step2 = null;
                fail2 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step2 = null;
                fail2 = null;
              }
          }
          return canceler;
        };
      }
      function join7(cb2) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb2
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill,
        join: join7,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        }
      };
    }
    function runPar(util, supervisor, par, cb2) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root = EMPTY;
      function kill(error3, par2, cb3) {
        var step2 = par2;
        var head2 = null;
        var tail2 = null;
        var count2 = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step2.tag) {
              case FORKED:
                if (step2._3 === EMPTY) {
                  tmp = fibers[step2._1];
                  kills2[count2++] = tmp.kill(error3, function(result) {
                    return function() {
                      count2--;
                      if (count2 === 0) {
                        cb3(result)();
                      }
                    };
                  });
                }
                if (head2 === null) {
                  break loop;
                }
                step2 = head2._2;
                if (tail2 === null) {
                  head2 = null;
                } else {
                  head2 = tail2._1;
                  tail2 = tail2._2;
                }
                break;
              case MAP:
                step2 = step2._2;
                break;
              case APPLY:
              case ALT:
                if (head2) {
                  tail2 = new Aff2(CONS, head2, tail2);
                }
                head2 = step2;
                step2 = step2._1;
                break;
            }
          }
        if (count2 === 0) {
          cb3(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count2;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join7(result, head2, tail2) {
        var fail2, step2, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
          fail2 = result;
          step2 = null;
        } else {
          step2 = result;
          fail2 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head2 === null) {
              cb2(fail2 || step2)();
              return;
            }
            if (head2._3 !== EMPTY) {
              return;
            }
            switch (head2.tag) {
              case MAP:
                if (fail2 === null) {
                  head2._3 = util.right(head2._1(util.fromRight(step2)));
                  step2 = head2._3;
                } else {
                  head2._3 = fail2;
                }
                break;
              case APPLY:
                lhs = head2._1._3;
                rhs = head2._2._3;
                if (fail2) {
                  head2._3 = fail2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, fail2 === lhs ? head2._2 : head2._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join7(fail2, null, null);
                      } else {
                        join7(fail2, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step2 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                  head2._3 = step2;
                }
                break;
              case ALT:
                lhs = head2._1._3;
                rhs = head2._2._3;
                if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                  fail2 = step2 === lhs ? rhs : lhs;
                  step2 = null;
                  head2._3 = fail2;
                } else {
                  head2._3 = step2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, step2 === lhs ? head2._2 : head2._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join7(step2, null, null);
                      } else {
                        join7(step2, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail2 === null) {
              head2 = null;
            } else {
              head2 = tail2._1;
              tail2 = tail2._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join7(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step2 = par;
        var head2 = null;
        var tail2 = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step2.tag) {
                  case MAP:
                    if (head2) {
                      tail2 = new Aff2(CONS, head2, tail2);
                    }
                    head2 = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                    step2 = step2._2;
                    break;
                  case APPLY:
                    if (head2) {
                      tail2 = new Aff2(CONS, head2, tail2);
                    }
                    head2 = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  case ALT:
                    if (head2) {
                      tail2 = new Aff2(CONS, head2, tail2);
                    }
                    head2 = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                    step2 = step2._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step2;
                    step2 = new Aff2(FORKED, fid, new Aff2(CONS, head2, tail2), EMPTY);
                    tmp = Fiber(util, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step2)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head2 === null) {
                  break loop;
                }
                if (head2._1 === EMPTY) {
                  head2._1 = step2;
                  status = CONTINUE;
                  step2 = head2._2;
                  head2._2 = EMPTY;
                } else {
                  head2._2 = step2;
                  step2 = head2;
                  if (tail2 === null) {
                    head2 = null;
                  } else {
                    head2 = tail2._1;
                    tail2 = tail2._2;
                  }
                }
            }
          }
        root = step2;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error3, cb3) {
        interrupt = util.left(error3);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill(error3, root, cb3);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run3();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential2(util, supervisor, par) {
      return new Aff2(ASYNC, function(cb2) {
        return function() {
          return runPar(util, supervisor, par, cb2);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value15) {
          return Aff.Pure(f(value15));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f) {
    return function(aff) {
      return Aff.ParMap(f, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function _makeFiber(util, aff) {
    return function() {
      return Aff.Fiber(util, null, aff);
    };
  }
  var _sequential = Aff.Seq;

  // output/Control.Monad.Except.Trans/index.js
  var map21 = /* @__PURE__ */ map(functorEither);
  var ExceptT = function(x) {
    return x;
  };
  var runExceptT = function(v) {
    return v;
  };
  var mapExceptT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map110 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map110(map21(f)));
      }
    };
  };
  var monadExceptT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeExceptT(dictMonad);
      },
      Bind1: function() {
        return bindExceptT(dictMonad);
      }
    };
  };
  var bindExceptT = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    var pure15 = pure(dictMonad.Applicative0());
    return {
      bind: function(v) {
        return function(k) {
          return bind9(v)(either(function($187) {
            return pure15(Left.create($187));
          })(function(a) {
            var v1 = k(a);
            return v1;
          }));
        };
      },
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var applyExceptT = function(dictMonad) {
    var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadExceptT(dictMonad)),
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
  var applicativeExceptT = function(dictMonad) {
    return {
      pure: function() {
        var $188 = pure(dictMonad.Applicative0());
        return function($189) {
          return ExceptT($188(Right.create($189)));
        };
      }(),
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var monadThrowExceptT = function(dictMonad) {
    var monadExceptT1 = monadExceptT(dictMonad);
    return {
      throwError: function() {
        var $198 = pure(dictMonad.Applicative0());
        return function($199) {
          return ExceptT($198(Left.create($199)));
        };
      }(),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var altExceptT = function(dictSemigroup) {
    var append9 = append(dictSemigroup);
    return function(dictMonad) {
      var Bind1 = dictMonad.Bind1();
      var bind9 = bind(Bind1);
      var pure15 = pure(dictMonad.Applicative0());
      var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
      return {
        alt: function(v) {
          return function(v1) {
            return bind9(v)(function(rm) {
              if (rm instanceof Right) {
                return pure15(new Right(rm.value0));
              }
              ;
              if (rm instanceof Left) {
                return bind9(v1)(function(rn) {
                  if (rn instanceof Right) {
                    return pure15(new Right(rn.value0));
                  }
                  ;
                  if (rn instanceof Left) {
                    return pure15(new Left(append9(rm.value0)(rn.value0)));
                  }
                  ;
                  throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
                });
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
            });
          };
        },
        Functor0: function() {
          return functorExceptT1;
        }
      };
    };
  };

  // output/Control.Parallel.Class/index.js
  var sequential = function(dict) {
    return dict.sequential;
  };
  var parallel = function(dict) {
    return dict.parallel;
  };

  // output/Control.Parallel/index.js
  var identity10 = /* @__PURE__ */ identity(categoryFn);
  var parTraverse_ = function(dictParallel) {
    var sequential2 = sequential(dictParallel);
    var parallel3 = parallel(dictParallel);
    return function(dictApplicative) {
      var traverse_4 = traverse_(dictApplicative);
      return function(dictFoldable) {
        var traverse_1 = traverse_4(dictFoldable);
        return function(f) {
          var $51 = traverse_1(function($53) {
            return parallel3(f($53));
          });
          return function($52) {
            return sequential2($51($52));
          };
        };
      };
    };
  };
  var parSequence_ = function(dictParallel) {
    var parTraverse_1 = parTraverse_(dictParallel);
    return function(dictApplicative) {
      var parTraverse_2 = parTraverse_1(dictApplicative);
      return function(dictFoldable) {
        return parTraverse_2(dictFoldable)(identity10);
      };
    };
  };

  // output/Effect.Aff/index.js
  var $runtime_lazy4 = function(name15, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name15 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var $$void10 = /* @__PURE__ */ $$void(functorEffect);
  var functorParAff = {
    map: _parAffMap
  };
  var functorAff = {
    map: _map
  };
  var ffiUtil = /* @__PURE__ */ function() {
    var unsafeFromRight = function(v) {
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      if (v instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
    };
    var unsafeFromLeft = function(v) {
      if (v instanceof Left) {
        return v.value0;
      }
      ;
      if (v instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
    };
    var isLeft = function(v) {
      if (v instanceof Left) {
        return true;
      }
      ;
      if (v instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
    };
    return {
      isLeft,
      fromLeft: unsafeFromLeft,
      fromRight: unsafeFromRight,
      left: Left.create,
      right: Right.create
    };
  }();
  var makeFiber = function(aff) {
    return _makeFiber(ffiUtil, aff);
  };
  var launchAff = function(aff) {
    return function __do5() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var applyParAff = {
    apply: _parAffApply,
    Functor0: function() {
      return functorParAff;
    }
  };
  var monadAff = {
    Applicative0: function() {
      return applicativeAff;
    },
    Bind1: function() {
      return bindAff;
    }
  };
  var bindAff = {
    bind: _bind,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var applicativeAff = {
    pure: _pure,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy4("applyAff", "Effect.Aff", function() {
    return {
      apply: ap(monadAff),
      Functor0: function() {
        return functorAff;
      }
    };
  });
  var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
  var pure23 = /* @__PURE__ */ pure(applicativeAff);
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindAff);
  var parallelAff = {
    parallel: unsafeCoerce,
    sequential: _sequential,
    Apply0: function() {
      return applyAff;
    },
    Apply1: function() {
      return applyParAff;
    }
  };
  var parallel2 = /* @__PURE__ */ parallel(parallelAff);
  var applicativeParAff = {
    pure: function($76) {
      return parallel2(pure23($76));
    },
    Apply0: function() {
      return applyParAff;
    }
  };
  var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableArray);
  var semigroupCanceler = {
    append: function(v) {
      return function(v1) {
        return function(err) {
          return parSequence_2([v(err), v1(err)]);
        };
      };
    }
  };
  var monadEffectAff = {
    liftEffect: _liftEffect,
    Monad0: function() {
      return monadAff;
    }
  };
  var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var monadThrowAff = {
    throwError: _throwError,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadErrorAff = {
    catchError: _catchError,
    MonadThrow0: function() {
      return monadThrowAff;
    }
  };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = function(k) {
    return function(aff) {
      return launchAff(bindFlipped2(function($83) {
        return liftEffect2(k($83));
      })($$try2(aff)));
    };
  };
  var runAff_ = function(k) {
    return function(aff) {
      return $$void10(runAff(k)(aff));
    };
  };
  var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure23(unit));
  var monoidCanceler = {
    mempty: nonCanceler,
    Semigroup0: function() {
      return semigroupCanceler;
    }
  };

  // output/Web.Event.Event/foreign.js
  function _target(e) {
    return e.target;
  }

  // output/Web.Event.Event/index.js
  var target5 = function($3) {
    return toMaybe(_target($3));
  };

  // output/Deku.DOM.Combinators/index.js
  var map23 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var for_9 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var bind6 = /* @__PURE__ */ bind(bindMaybe);
  var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindEffect);
  var numberOn = function(listener) {
    var $25 = map23(function(push2) {
      return function(e) {
        return for_9(bind6(target5(e))(fromEventTarget))(composeKleisli2(valueAsNumber)(push2));
      };
    });
    return function($26) {
      return listener($25($26));
    };
  };

  // output/Deku.DOM.Attributes/index.js
  var map24 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var pure11 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeAPoll(applyEvent));
  var xtype = /* @__PURE__ */ map24(function($240) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "type",
        value: v
      };
    }(prop$prime($240)));
  });
  var xtype_ = function($241) {
    return xtype(pure11($241));
  };
  var xtypeNumber = /* @__PURE__ */ xtype_("number");
  var value14 = /* @__PURE__ */ map24(function($254) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "value",
        value: v
      };
    }(prop$prime($254)));
  });
  var value_ = function($255) {
    return value14(pure11($255));
  };
  var style = /* @__PURE__ */ map24(function($280) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "style",
        value: v
      };
    }(prop$prime($280)));
  });
  var style_ = function($281) {
    return style(pure11($281));
  };
  var id = /* @__PURE__ */ map24(function($450) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "id",
        value: v
      };
    }(prop$prime($450)));
  });
  var id_ = function($451) {
    return id(pure11($451));
  };

  // output/Deku.DOM.Listeners/index.js
  var map25 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var pointerup = /* @__PURE__ */ map25(function($215) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "pointerup",
        value: v
      };
    }(cb$prime(cb($215))));
  });
  var pointermove = /* @__PURE__ */ map25(function($223) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "pointermove",
        value: v
      };
    }(cb$prime(cb($223))));
  });
  var pointerdown = /* @__PURE__ */ map25(function($229) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "pointerdown",
        value: v
      };
    }(cb$prime(cb($229))));
  });
  var pointercancel = /* @__PURE__ */ map25(function($231) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "pointercancel",
        value: v
      };
    }(cb$prime(cb($231))));
  });
  var input2 = /* @__PURE__ */ map25(function($295) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "input",
        value: v
      };
    }(cb$prime(cb($295))));
  });
  var click2 = /* @__PURE__ */ map25(function($385) {
    return unsafeAttribute(/* @__PURE__ */ function(v) {
      return {
        key: "click",
        value: v
      };
    }(cb$prime(cb($385))));
  });

  // output/Deku.Do/index.js
  var bind7 = function(f) {
    return function(a) {
      return f(a);
    };
  };

  // output/Deku.Hooks/index.js
  var eq3 = /* @__PURE__ */ eq(eqScope);
  var empty8 = /* @__PURE__ */ empty(/* @__PURE__ */ plusAPoll(plusEvent));
  var pollable4 = /* @__PURE__ */ pollable(eventIsEvent);
  var sample6 = /* @__PURE__ */ sample(pollable4);
  var identity11 = /* @__PURE__ */ identity(categoryFn);
  var mailbox3 = /* @__PURE__ */ mailbox2(ordInt);
  var functorAPoll2 = /* @__PURE__ */ functorAPoll(functorEvent);
  var voidLeft3 = /* @__PURE__ */ voidLeft(functorAPoll2);
  var map26 = /* @__PURE__ */ map(functorAPoll2);
  var mapWithIndex4 = /* @__PURE__ */ mapWithIndex(/* @__PURE__ */ functorWithIndexAPoll(eventIsEvent)(pollable4));
  var mapAccum2 = /* @__PURE__ */ mapAccum(/* @__PURE__ */ isEventAPoll(eventIsEvent)(plusEvent)(pollable4));
  var alt5 = /* @__PURE__ */ alt(/* @__PURE__ */ altAPoll(altEvent));
  var filterMap4 = /* @__PURE__ */ filterMap(/* @__PURE__ */ filterableAPoll(functorEvent)(compactableEvent)(pollable4));
  var sample_4 = /* @__PURE__ */ sample_(pollable4)(functorEvent)(functorEvent);
  var $$void11 = /* @__PURE__ */ $$void(functorST);
  var liftST7 = /* @__PURE__ */ liftST(monadSTST);
  var flattenArgs2 = {
    doLogic: function(pos) {
      return function(v) {
        return function(id2) {
          return v.sendToPos({
            id: id2,
            pos
          });
        };
      };
    },
    ids: /* @__PURE__ */ function() {
      var $142 = unwrap();
      return function($143) {
        return function(v) {
          return v.ids;
        }($142($143));
      };
    }(),
    deferPayload: function(v) {
      return v.deferPayload;
    },
    forcePayload: function(v) {
      return v.forcePayload;
    },
    disconnectElement: function(v) {
      return function(v1) {
        return v.disconnectElement({
          id: v1.id,
          scope: v1.scope,
          parent: v1.parent,
          scopeEq: eq3
        });
      };
    },
    toElt: function(v) {
      return v;
    }
  };
  var dynOptions = {
    sendTo: function(v) {
      return empty8;
    },
    remove: function(v) {
      return empty8;
    }
  };
  var __internalDekuFlatten4 = function(v) {
    return function(a) {
      return function(b) {
        return flatten(flattenArgs2)(v)(a)(b);
      };
    };
  };
  var useDeflect = function(e) {
    return function(f) {
      var go2 = function(i) {
        return function(di) {
          return behaving$prime(function(v) {
            return function(ee) {
              return function(v1) {
                return function(subscribe2) {
                  return function __do5() {
                    var p = deflect(e)();
                    var v2 = f(p);
                    return subscribe2(sample6(__internalDekuFlatten4(v2)(i)(di))(ee))(identity11)();
                  };
                };
              };
            };
          });
        };
      };
      var go$prime = new Element$prime(go2);
      return go$prime;
    };
  };
  var useDynWith = function(e) {
    return function(opts) {
      return function(f) {
        var go2 = function(i) {
          return function(di) {
            return behaving(function(ee) {
              return function(v) {
                return function(subscribe2) {
                  return function __do5() {
                    var c1 = mailbox3();
                    var mc = function(ix) {
                      return function(v12) {
                        return new Tuple(merge2([voidLeft3(opts.remove(v12.value1))(Remove.value), map26(function($144) {
                          return Child(Logic.create($144));
                        })(opts.sendTo(v12.value1)), c1.poll(ix)]), unsafeSetPos(v12.value0)(f({
                          value: v12.value1,
                          remove: c1.push({
                            address: ix,
                            payload: remove
                          }),
                          sendTo: function($145) {
                            return c1.push(/* @__PURE__ */ function(v3) {
                              return {
                                address: ix,
                                payload: v3
                              };
                            }(sendToPos($145)));
                          }
                        })));
                      };
                    };
                    var v1 = dyn2(mapWithIndex4(mc)(e));
                    return subscribe2(sample6(__internalDekuFlatten4(v1)(i)(di))(ee))();
                  };
                };
              };
            });
          };
        };
        var go$prime = new Element$prime(go2);
        return go$prime;
      };
    };
  };
  var useDynAtBeginningWith = function(e) {
    return useDynWith(map26(function(v) {
      return new Tuple(0, v);
    })(e));
  };
  var useRant = function(e) {
    return function(f) {
      var go2 = function(i) {
        return function(di) {
          return behaving$prime(function(v) {
            return function(ee) {
              return function(v1) {
                return function(subscribe2) {
                  return function __do5() {
                    var v2 = rant(e)();
                    var v3 = f(v2.poll);
                    return subscribe2(sample6(__internalDekuFlatten4(v3)(i)(di))(ee))(identity11)();
                  };
                };
              };
            };
          });
        };
      };
      var go$prime = new Element$prime(go2);
      return go$prime;
    };
  };
  var switcher = function(f) {
    return function(poll2) {
      var counter = function() {
        var fn = function(a) {
          return function(b) {
            return new Tuple(a + 1 | 0, new Tuple(a, b));
          };
        };
        return mapAccum2(fn)(0);
      }();
      return bind7(useRant(counter(poll2)))(function(ctr) {
        return bind7(useDeflect(counter(poll2)))(function(dctr) {
          return bind7(useDynAtBeginningWith(alt5(ctr)(dctr))({
            sendTo: dynOptions.sendTo,
            remove: function(v1) {
              return filterMap4(function(v2) {
                var $115 = v2.value0 === (v1.value0 + 1 | 0);
                if ($115) {
                  return new Just(unit);
                }
                ;
                return Nothing.value;
              })(ctr);
            }
          }))(function(v) {
            return f(snd(v.value));
          });
        });
      });
    };
  };
  var switcherFlipped = function(a) {
    return function(b) {
      return switcher(b)(a);
    };
  };
  var useRefST = function(a) {
    return function(e) {
      return function(makeHook) {
        var go2 = function(i) {
          return function(di) {
            return behaving$prime(function(v) {
              return function(ee) {
                return function(v1) {
                  return function(subscribe2) {
                    return function __do5() {
                      var rf = newSTRef(a)();
                      var v2 = makeHook(read(rf));
                      subscribe2(sample_4(e)(ee))(function(v3) {
                        return function(x) {
                          return $$void11(liftST7(write(x)(rf)));
                        };
                      })();
                      return subscribe2(sample6(__internalDekuFlatten4(v2)(i)(di))(ee))(identity11)();
                    };
                  };
                };
              };
            });
          };
        };
        var go$prime = new Element$prime(go2);
        return go$prime;
      };
    };
  };
  var useState$prime = function(f) {
    var go2 = function(i) {
      return function(di) {
        return behaving(function(ee) {
          return function(v) {
            return function(subscribe2) {
              return function __do5() {
                var v1 = create4();
                var v2 = f(new Tuple(v1.push, v1.poll));
                return subscribe2(sample6(__internalDekuFlatten4(v2)(i)(di))(ee))();
              };
            };
          };
        });
      };
    };
    var go$prime = new Element$prime(go2);
    return go$prime;
  };
  var useHot = function(a) {
    return function(f) {
      return bind7(useState$prime)(function(v) {
        return bind7(useRefST(a)(v.value1))(function(r) {
          return f(new Tuple(v.value0, alt5(stToPoll(r))(v.value1)));
        });
      });
    };
  };

  // output/Types/index.js
  var Start = /* @__PURE__ */ function() {
    function Start2(value0) {
      this.value0 = value0;
    }
    ;
    Start2.create = function(value0) {
      return new Start2(value0);
    };
    return Start2;
  }();
  var Move = /* @__PURE__ */ function() {
    function Move2(value0) {
      this.value0 = value0;
    }
    ;
    Move2.create = function(value0) {
      return new Move2(value0);
    };
    return Move2;
  }();
  var Stop = /* @__PURE__ */ function() {
    function Stop2(value0) {
      this.value0 = value0;
    }
    ;
    Stop2.create = function(value0) {
      return new Stop2(value0);
    };
    return Stop2;
  }();
  var Instrument = /* @__PURE__ */ function() {
    function Instrument2() {
    }
    ;
    Instrument2.value = new Instrument2();
    return Instrument2;
  }();
  var Manual = /* @__PURE__ */ function() {
    function Manual2() {
    }
    ;
    Manual2.value = new Manual2();
    return Manual2;
  }();
  var showMode = {
    show: function(v) {
      if (v instanceof Instrument) {
        return "Instrument";
      }
      ;
      if (v instanceof Manual) {
        return "Manual";
      }
      ;
      throw new Error("Failed pattern match at Types (line 27, column 1 - line 29, column 29): " + [v.constructor.name]);
    }
  };
  var eqMode = {
    eq: function(x) {
      return function(y) {
        if (x instanceof Instrument && y instanceof Instrument) {
          return true;
        }
        ;
        if (x instanceof Manual && y instanceof Manual) {
          return true;
        }
        ;
        return false;
      };
    }
  };
  var defaultSettings = /* @__PURE__ */ function() {
    return {
      mode: Instrument.value,
      leftPitch: 48,
      rightPitch: 72,
      blackKeyRatio: 0.8
    };
  }();

  // output/Util/foreign.js
  function offsetX(event) {
    return event.offsetX;
  }
  function offsetY(event) {
    return event.offsetY;
  }

  // output/Web.Resize.Observer/foreign.js
  var _newResizeObserver = (callback) => () => {
    const uncurried = (a, o) => {
      callback(a)(o)();
    };
    return new ResizeObserver(uncurried);
  };
  var observe = (resizeObserver) => (element2) => () => {
    resizeObserver.observe(element2);
  };

  // output/Web.Resize.Observer/index.js
  var newResizeObserver = function(c) {
    return _newResizeObserver(c);
  };

  // output/Util/index.js
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
  var onResizeE = function(callback) {
    return self_(function(element2) {
      return function __do5() {
        var observer = newResizeObserver(callback(element2))();
        return observe(observer)(element2)();
      };
    });
  };
  var onResizeE_ = function(callback) {
    return onResizeE(function(element2) {
      return function(entries) {
        return function(v) {
          var applyCallback = function(cb2) {
            return function(entry) {
              return cb2(element2)(entry.contentRect.width)(entry.contentRect.height);
            };
          };
          return traverse_3(applyCallback(callback))(entries);
        };
      };
    });
  };
  var onResize = function(callback) {
    return self_(function(element2) {
      return function __do5() {
        var observer = newResizeObserver(callback)();
        return observe(observer)(element2)();
      };
    });
  };
  var onResize_ = function(callback) {
    return onResize(function(entries) {
      return function(v) {
        var applyCallback = function(cb2) {
          return function(entry) {
            return cb2(entry.contentRect.width)(entry.contentRect.height);
          };
        };
        return traverse_3(applyCallback(callback))(entries);
      };
    });
  };

  // output/Web.PointerEvent.PointerEvent/foreign.js
  function pressure(ev) {
    return ev.pressure;
  }

  // output/Web.PointerEvent.PointerEvent/index.js
  var toMouseEvent = unsafeCoerce;

  // output/ControlSurface/index.js
  var discard3 = /* @__PURE__ */ discard(discardUnit);
  var discard22 = /* @__PURE__ */ discard3(bindStyleM);
  var apply6 = /* @__PURE__ */ apply(/* @__PURE__ */ applyAPoll(applyEvent));
  var map27 = /* @__PURE__ */ map(/* @__PURE__ */ functorAPoll(functorEvent));
  var pure14 = /* @__PURE__ */ pure(applicativeEffect);
  var for_10 = /* @__PURE__ */ for_(applicativeEffect)(foldableArray);
  var when3 = /* @__PURE__ */ when(applicativeEffect);
  var elem3 = /* @__PURE__ */ elem(foldableArray)(eqInt);
  var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
  var flap2 = /* @__PURE__ */ flap(functorArray);
  var resizeCanvas = function(element2) {
    return function(w) {
      return function(h) {
        var v = fromElement(element2);
        if (v instanceof Nothing) {
          return $$throw("Error: Element is not a canvas.");
        }
        ;
        if (v instanceof Just) {
          return function __do5() {
            setWidth8(v.value0)(w)();
            return setHeight8(v.value0)(h)();
          };
        }
        ;
        throw new Error("Failed pattern match at ControlSurface (line 138, column 3 - line 142, column 32): " + [v.constructor.name]);
      };
    };
  };
  var onPointerStop = function(wires) {
    return function(width10) {
      return function(height10) {
        return function(ptrEvt) {
          var mouseEvt = toMouseEvent(ptrEvt);
          return wires.surfaceOut.push(new Stop({
            x: offsetX(mouseEvt) / width10,
            y: offsetY(mouseEvt) / height10
          }));
        };
      };
    };
  };
  var onPointerStart = function(wires) {
    return function(width10) {
      return function(height10) {
        return function(ptrEvt) {
          var mouseEvt = toMouseEvent(ptrEvt);
          return wires.surfaceOut.push(new Start({
            x: offsetX(mouseEvt) / width10,
            y: offsetY(mouseEvt) / height10,
            pressure: pressure(ptrEvt)
          }));
        };
      };
    };
  };
  var onPointerMove = function(wires) {
    return function(width10) {
      return function(height10) {
        return function(ptrEvt) {
          var mouseEvt = toMouseEvent(ptrEvt);
          return wires.surfaceOut.push(new Move({
            x: offsetX(mouseEvt) / width10,
            y: offsetY(mouseEvt) / height10,
            pressure: pressure(ptrEvt)
          }));
        };
      };
    };
  };
  var layerProperties = function(zIndex2) {
    return discard22(position2(absolute))(function() {
      return discard22(height8(pct(100)))(function() {
        return discard22(width8(pct(100)))(function() {
          return zIndex(zIndex2);
        });
      });
    });
  };
  var middleCanvas = function(v) {
    return canvas([id_("middleCanvas"), style_(render(layerProperties(1))), onResizeE_(resizeCanvas)])([]);
  };
  var foregroundCanvas = function(width10) {
    return function(height10) {
      return function(wires) {
        return canvas([id_("foregroundCanvas"), style_(render(layerProperties(2))), pointerdown(apply6(map27(onPointerStart(wires))(width10))(height10)), pointerup(apply6(map27(onPointerStop(wires))(width10))(height10)), pointercancel(apply6(map27(onPointerStop(wires))(width10))(height10)), pointermove(apply6(map27(onPointerMove(wires))(width10))(height10)), onResizeE_(resizeCanvas)])([text_("Your browser does not support the canvas element.")]);
      };
    };
  };
  var drawBackground = function(settings) {
    return function(width10) {
      return function(height10) {
        return function(element2) {
          var v = settings.leftPitch === settings.rightPitch;
          if (v) {
            return pure14(unit);
          }
          ;
          if (!v) {
            var v1 = fromElement(element2);
            if (v1 instanceof Nothing) {
              return $$throw("Error: Element is not a canvas.");
            }
            ;
            if (v1 instanceof Just) {
              var wholeArea = {
                x: 0,
                y: 0,
                width: width10,
                height: height10
              };
              var context = context2D(v1.value0);
              return function __do5() {
                clearRect(context)(wholeArea)();
                setFillStyle(context)(white)();
                fillRect(context)(wholeArea)();
                return for_10(range2(floor2(settings.leftPitch))(ceil2(settings.rightPitch)))(function(note2) {
                  var semitoneWidth = width10 / (settings.rightPitch - settings.leftPitch);
                  var position3 = semitoneWidth * (toNumber(note2) - settings.leftPitch);
                  return function __do6() {
                    when3(elem3(mod2(note2)(12))([1, 3, 6, 8, 10]))(function __do7() {
                      setFillStyle(context)(graytone(0.5))();
                      var blackWidth = settings.blackKeyRatio * semitoneWidth;
                      var keyArea = {
                        x: position3 - blackWidth / 2,
                        y: 0,
                        width: blackWidth,
                        height: height10
                      };
                      return fillRect(context)(keyArea)();
                    })();
                    beginPath(context)();
                    moveTo2(context)(position3)(0)();
                    lineTo(context)(position3)(height10)();
                    return stroke(context)();
                  };
                })();
              };
            }
            ;
            throw new Error("Failed pattern match at ControlSurface (line 151, column 14 - line 180, column 32): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at ControlSurface (line 149, column 3 - line 180, column 32): " + [v.constructor.name]);
        };
      };
    };
  };
  var backgroundCanvas = function(width10) {
    return function(height10) {
      return function(wires) {
        return canvas([id_("backgroundCanvas"), style_(render(layerProperties(0))), self(apply6(apply6(map27(drawBackground)(wires.settings))(width10))(height10)), onResizeE_(function(elt) {
          return function(w) {
            return function(h) {
              return function __do5() {
                resizeCanvas(elt)(w)(h)();
                return wires.refreshBackground.push(unit)();
              };
            };
          };
        })])([]);
      };
    };
  };
  var component = function(wires) {
    return bind7(useHot(0))(function(v) {
      return bind7(useHot(0))(function(v1) {
        return div2([id_("controlSurface"), style_(render(discard22(position2(relative))(function() {
          return discard22(border2(solid)(px(1))(black))(function() {
            return discard22(height8(px(300)))(function() {
              return width8(pct(100));
            });
          });
        }))), onResize_(function(w) {
          return function(h) {
            return function __do5() {
              v.value0(w)();
              return v1.value0(h)();
            };
          };
        })])(flap2([foregroundCanvas(v.value1)(v1.value1), middleCanvas, backgroundCanvas(v.value1)(v1.value1)])(wires));
      });
    });
  };

  // output/Effect.Class.Console/index.js
  var log3 = function(dictMonadEffect) {
    var $67 = liftEffect(dictMonadEffect);
    return function($68) {
      return $67(log2($68));
    };
  };

  // output/MidiEmitter/index.js
  var log4 = /* @__PURE__ */ log3(monadEffectEffect);
  var show7 = /* @__PURE__ */ show(showInt);
  var show1 = /* @__PURE__ */ show(showNumber);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(/* @__PURE__ */ functorAPoll(functorEvent));
  var $$void12 = /* @__PURE__ */ $$void(functorEffect);
  var surfaceMsgCallback = function(settings) {
    return function(ref) {
      return function(msg) {
        var toPitch = function(x) {
          var $17 = settings.leftPitch === settings.rightPitch;
          if ($17) {
            return settings.leftPitch;
          }
          ;
          return settings.leftPitch + x * (settings.rightPitch - settings.leftPitch);
        };
        return function __do5() {
          var oldState = toEffect(read(ref))();
          var v = new Tuple(oldState.currentNote, msg);
          if (v.value0 instanceof Nothing && v.value1 instanceof Stop) {
            return unit;
          }
          ;
          if (v.value0 instanceof Nothing && v.value1 instanceof Move) {
            return unit;
          }
          ;
          if (v.value0 instanceof Nothing && v.value1 instanceof Start) {
            var pitch = toPitch(v.value1.value0.x);
            var newNote = round2(pitch);
            toEffect(write({
              currentNote: new Just(newNote)
            })(ref))();
            log4("NoteOn " + show7(newNote))();
            log4("Pitch bend " + show1(pitch - toNumber(newNote)))();
            return log4("Aftertouch " + show1(v.value1.value0.pressure))();
          }
          ;
          if (v.value0 instanceof Just && v.value1 instanceof Move) {
            var pitch = toPitch(v.value1.value0.x);
            log4("Pitch bend " + show1(pitch - toNumber(v.value0.value0)))();
            return log4("Aftertouch " + show1(v.value1.value0.pressure))();
          }
          ;
          if (v.value0 instanceof Just && v.value1 instanceof Start) {
            var pitch = toPitch(v.value1.value0.x);
            log4("Pitchbend " + show1(pitch - toNumber(v.value0.value0)))();
            return log4("Aftertouch " + show1(v.value1.value0.pressure))();
          }
          ;
          if (v.value0 instanceof Just && v.value1 instanceof Stop) {
            toEffect(write({
              currentNote: Nothing.value
            })(ref))();
            return log4("NoteOff " + show7(v.value0.value0))();
          }
          ;
          throw new Error("Failed pattern match at MidiEmitter (line 79, column 3 - line 117, column 36): " + [v.constructor.name]);
        };
      };
    };
  };
  var component2 = function(wires) {
    return div2([self(mapFlipped2(wires.settings)(function(settings) {
      return function(v) {
        return function __do5() {
          var stateRef = toEffect(newSTRef({
            currentNote: Nothing.value
          }))();
          return $$void12(toEffect(subscribe(wires.surfaceOut.event)(surfaceMsgCallback(settings)(stateRef))))();
        };
      };
    })), id_("dummyMidiEmitterNode")])([]);
  };

  // output/CSS.Background/index.js
  var fromString14 = /* @__PURE__ */ fromString(isStringKey);
  var key4 = /* @__PURE__ */ key(valColor);
  var backgroundColor = /* @__PURE__ */ key4(/* @__PURE__ */ fromString14("background-color"));

  // output/CSS.Font/index.js
  var fromString15 = /* @__PURE__ */ fromString(isStringKey);
  var color = /* @__PURE__ */ key(valColor)(/* @__PURE__ */ fromString15("color"));

  // output/WebMidi/foreign.js
  var requestAccessImpl = (just) => (nothing) => () => {
    return navigator.requestMIDIAccess().then(
      (access) => {
        return just(access);
      },
      (reason) => {
        return nothing;
      }
    );
  };
  var getOutputImpl = (just) => (nothing) => (access) => (id2) => {
    let result = access.outputs.get(id2);
    if (result === void 0) {
      return nothing;
    } else {
      return just(result);
    }
  };
  var outputIDs = (access) => {
    return Array.from(access.outputs.keys());
  };
  var outputName = (output) => {
    return output.name;
  };

  // output/Control.Promise/foreign.js
  function thenImpl(promise2) {
    return function(errCB) {
      return function(succCB) {
        return function() {
          promise2.then(succCB, errCB);
        };
      };
    };
  }

  // output/Control.Monad.Except/index.js
  var unwrap5 = /* @__PURE__ */ unwrap();
  var runExcept = function($3) {
    return unwrap5(runExceptT($3));
  };

  // output/Foreign/foreign.js
  function tagOf(value15) {
    return Object.prototype.toString.call(value15).slice(8, -1);
  }
  var isArray = Array.isArray || function(value15) {
    return Object.prototype.toString.call(value15) === "[object Array]";
  };

  // output/Data.List.NonEmpty/index.js
  var singleton7 = /* @__PURE__ */ function() {
    var $200 = singleton3(plusList);
    return function($201) {
      return NonEmptyList($200($201));
    };
  }();

  // output/Foreign/index.js
  var TypeMismatch = /* @__PURE__ */ function() {
    function TypeMismatch2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    TypeMismatch2.create = function(value0) {
      return function(value1) {
        return new TypeMismatch2(value0, value1);
      };
    };
    return TypeMismatch2;
  }();
  var unsafeFromForeign = unsafeCoerce;
  var fail = function(dictMonad) {
    var $153 = throwError(monadThrowExceptT(dictMonad));
    return function($154) {
      return $153(singleton7($154));
    };
  };
  var unsafeReadTagged = function(dictMonad) {
    var pure15 = pure(applicativeExceptT(dictMonad));
    var fail1 = fail(dictMonad);
    return function(tag) {
      return function(value15) {
        if (tagOf(value15) === tag) {
          return pure15(unsafeFromForeign(value15));
        }
        ;
        if (otherwise) {
          return fail1(new TypeMismatch(tag, tagOf(value15)));
        }
        ;
        throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value15.constructor.name]);
      };
    };
  };
  var readString = function(dictMonad) {
    return unsafeReadTagged(dictMonad)("String");
  };

  // output/Control.Promise/index.js
  var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
  var mempty4 = /* @__PURE__ */ mempty(monoidCanceler);
  var identity12 = /* @__PURE__ */ identity(categoryFn);
  var alt6 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
  var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
  var map28 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
  var readString2 = /* @__PURE__ */ readString(monadIdentity);
  var bind8 = /* @__PURE__ */ bind(bindAff);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var toAff$prime = function(customCoerce) {
    return function(p) {
      return makeAff(function(cb2) {
        return voidRight2(mempty4)(thenImpl(p)(function($14) {
          return cb2(Left.create(customCoerce($14)))();
        })(function($15) {
          return cb2(Right.create($15))();
        }));
      });
    };
  };
  var coerce5 = function(fn) {
    return either(function(v) {
      return error("Promise failed, couldn't extract JS Error or String");
    })(identity12)(runExcept(alt6(unsafeReadTagged2("Error")(fn))(map28(error)(readString2(fn)))));
  };
  var toAff = /* @__PURE__ */ toAff$prime(coerce5);
  var toAffE = function(f) {
    return bind8(liftEffect3(f))(toAff);
  };

  // output/WebMidi/index.js
  var requestAccess = /* @__PURE__ */ function() {
    return toAffE(requestAccessImpl(Just.create)(Nothing.value));
  }();
  var getOutput = /* @__PURE__ */ function() {
    return getOutputImpl(Just.create)(Nothing.value);
  }();

  // output/Settings/index.js
  var join6 = /* @__PURE__ */ join(bindMaybe);
  var mapFlipped3 = /* @__PURE__ */ mapFlipped(/* @__PURE__ */ functorAPoll(functorEvent));
  var discard4 = /* @__PURE__ */ discard(discardUnit);
  var discard23 = /* @__PURE__ */ discard4(bindStyleM);
  var mempty5 = /* @__PURE__ */ mempty(monoidNut);
  var mapFlipped1 = /* @__PURE__ */ mapFlipped(functorArray);
  var eq4 = /* @__PURE__ */ eq(eqMode);
  var show8 = /* @__PURE__ */ show(showMode);
  var flap3 = /* @__PURE__ */ flap(functorArray);
  var setAccess = function(wires) {
    return function(emAccess) {
      return wires.setMidiAccess(join6(hush(emAccess)));
    };
  };
  var rightPitchInput = function(wires) {
    return input([xtypeNumber, numberOn(input2)(mapFlipped3(wires.settings)(function(s) {
      return function(value15) {
        return function __do5() {
          wires.setSettings({
            mode: s.mode,
            leftPitch: s.leftPitch,
            blackKeyRatio: s.blackKeyRatio,
            rightPitch: value15
          })();
          return wires.refreshBackground.push(unit)();
        };
      };
    }))])([]);
  };
  var leftPitchInput = function(wires) {
    return input([xtypeNumber, numberOn(input2)(mapFlipped3(wires.settings)(function(s) {
      return function(value15) {
        return function __do5() {
          wires.setSettings({
            mode: s.mode,
            rightPitch: s.rightPitch,
            blackKeyRatio: s.blackKeyRatio,
            leftPitch: value15
          })();
          return wires.refreshBackground.push(unit)();
        };
      };
    }))])([]);
  };
  var inactiveButtonStyle = /* @__PURE__ */ discard23(/* @__PURE__ */ backgroundColor(white))(function() {
    return color(black);
  });
  var dropdown = function(wires) {
    return switcherFlipped(wires.midiAccess)(function(v) {
      if (v instanceof Nothing) {
        return mempty5;
      }
      ;
      if (v instanceof Just) {
        return fixed2(mapFlipped1(outputIDs(v.value0))(function(id2) {
          var v1 = getOutput(v.value0)(id2);
          if (v1 instanceof Nothing) {
            return mempty5;
          }
          ;
          if (v1 instanceof Just) {
            return option([value_(id2)])([text_(outputName(v1.value0))]);
          }
          ;
          throw new Error("Failed pattern match at Settings (line 117, column 5 - line 121, column 60): " + [v1.constructor.name]);
        }));
      }
      ;
      throw new Error("Failed pattern match at Settings (line 114, column 40 - line 121, column 60): " + [v.constructor.name]);
    });
  };
  var midiOutputDropdown = function(wires) {
    return select3([self_(function(v) {
      return runAff_(setAccess(wires))(requestAccess);
    })])([dropdown(wires)]);
  };
  var activeButtonStyle = /* @__PURE__ */ discard23(/* @__PURE__ */ backgroundColor(/* @__PURE__ */ rgb$prime(0.1)(0.1)(0.6)))(function() {
    return color(white);
  });
  var modeButton = function(mode) {
    return function(wires) {
      return button([style(mapFlipped3(wires.settings)(function(s) {
        return render(function() {
          var $22 = eq4(s.mode)(mode);
          if ($22) {
            return activeButtonStyle;
          }
          ;
          return inactiveButtonStyle;
        }());
      })), click2(mapFlipped3(wires.settings)(function(s) {
        return $$const(wires.setSettings({
          leftPitch: s.leftPitch,
          rightPitch: s.rightPitch,
          blackKeyRatio: s.blackKeyRatio,
          mode
        }));
      }))])([text_(show8(mode) + " Mode")]);
    };
  };
  var component3 = function(wires) {
    return div_(flap3([modeButton(Instrument.value), modeButton(Manual.value), leftPitchInput, rightPitchInput, midiOutputDropdown])(wires));
  };

  // output/Galatea/index.js
  var galatea = function __do4() {
    var surfaceOut = create();
    var refreshBackground = create();
    return bind7(useHot(defaultSettings))(function(v) {
      return bind7(useHot(Nothing.value))(function(v1) {
        return bind7(useHot(Nothing.value))(function(v2) {
          var wires = {
            surfaceOut,
            refreshBackground,
            settings: v.value1,
            setSettings: v.value0,
            midiAccess: v1.value1,
            setMidiAccess: v1.value0,
            midiOutput: v2.value1,
            setMidiOutput: v2.value0
          };
          return div2([id_("galatea")])([component(wires), component3(wires), component2(wires)]);
        });
      });
    });
  };

  // output/Main/index.js
  var main = /* @__PURE__ */ bindFlipped(bindEffect)(runInBody)(/* @__PURE__ */ liftST(monadSTEffect)(galatea));

  // <stdin>
  main();
})();
