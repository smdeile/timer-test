import React, { useEffect, useState, useCallback } from "react";

import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, debounceTime, map, buffer, filter } from "rxjs/operators";

export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec((val) => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  const start = useCallback(() => {
    setStatus("run");
  }, []);

  const stop = useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);

  const reset = useCallback(() => {
    setSec(0);
  }, []);

  const handleWait = useCallback((e) => {
    const click$ = fromEvent(e.target, e.type);
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((clicks) => clicks.length),
      filter((clicksLength) => clicksLength >= 2)
    );
    doubleClick$.subscribe(() => {
      setStatus("wait");
    });
  }, []);

  return (
    <div>
      <div className="background"></div>
      <div className="wrapper">
        <div>
          <h2 className="timerDisplay">
            {new Date(sec).toISOString().slice(11, 19)}
          </h2>
        </div>
        <div className="buttonBlock">
          <button className="start-button" onClick={start}>
            Start
          </button>
          <button className="stop-button" onClick={stop}>
            Stop
          </button>
          <button onClick={reset}>Reset</button>
          <button onClick={handleWait}>Wait</button>
        </div>
      </div>{" "}
    </div>
  );
}
