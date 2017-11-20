package com.newdytt;

import android.widget.LinearLayout;
// import android.graphics.Color;
// import android.widget.TextView;
// import android.view.Gravity;
// import android.util.TypedValue;
import android.widget.ImageView;
import com.newdytt.R;
import android.widget.ImageView.ScaleType;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {
    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        ImageView imagetView = new ImageView(this);

        //view.setBackgroundColor(Color.parseColor("#607D8B"));
        //view.setGravity(Gravity.CENTER);

        imagetView.setImageResource(R.drawable.launch_screen);

        imagetView.setLayoutParams(new LinearLayout.LayoutParams(-1,-1));

        imagetView.setScaleType(ScaleType.CENTER);

        // textView.setTextColor(Color.parseColor("#FFFFFF"));
        // textView.setText("React Native Navigation");
        // textView.setGravity(Gravity.CENTER);
        // textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 40);

        view.addView(imagetView);
        return view;
    }
}
