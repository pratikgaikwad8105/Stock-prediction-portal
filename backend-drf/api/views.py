from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import StockPredictionSerializer
from rest_framework.response import Response
from rest_framework import status
import yfinance as yf
import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score    


class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data = request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

            #Fetch data from Yfinance
            now = datetime.now()
            ticker = ticker 
            start = datetime(now.year - 10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)

            if df.empty:
                return Response({"error" : "No data Found for a given ticker", "status" : status.HTTP_404_NOT_FOUND })
            
            df = df.reset_index()
            
            # Generate Basic Plot
            plt.switch_backend("AGG")
            plt.figure(figsize=(10,5))
            plt.plot(df.Close, label = 'Closing Price')
            plt.title(f"Closing price of {ticker}")
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            
            # Save Plot
            plot_img_path = f'{ticker}_plot.png'
            plot_url = save_plot(plot_img_path)

            # 100 days moving Average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend("AGG")
            plt.figure(figsize=(10,5))
            plt.plot(df.Close, label = 'Closing Price')
            plt.plot(ma100, 'r' ,label = '100 DMA')
            plt.title(f"100 Days Moving Avg of {ticker}")
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            plot_img_path = f'{ticker}_100_dma.png'
            plot_100_dma_url = save_plot(plot_img_path)

            #200 days Moving Average
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend("AGG")
            plt.figure(figsize=(10,5))
            plt.plot(df.Close, label = 'Closing Price')
            plt.plot(ma100, 'r' ,label = '100 DMA')
            plt.plot(ma200, 'g' ,label = '200 DMA')
            plt.title(f"200 Days Moving Avg of {ticker}")
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            plot_img_path = f'{ticker}_200_dma.png'
            plot_200_dma_url = save_plot(plot_img_path)

            # Spliting data into training and testing 
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])

            # Scaling Down Data into 0 and 1 
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load Model
            model = load_model('Stock_prediction_model.h5')

            # Preparing Test Data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)

            input_data = scaler.fit_transform(final_df)


            x_test = []
            y_test = []

            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i - 100  : i])
                y_test.append(input_data[i, 0])
            
            x_test, y_test = np.array(x_test), np.array(y_test)

            # Making Prediction
            y_predicted = model.predict(x_test)

            # Revert the scaled to original
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

            # Plot the final prediction
            plt.switch_backend("AGG")
            plt.figure(figsize=(10,5))
            plt.plot(y_test, 'b', label = 'Original Price')
            plt.plot(y_predicted, 'r' ,label = 'Predicted Price')
            plt.title(f"Final Prediction of {ticker}")
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_final_prediction_url = save_plot(plot_img_path)

            #Model Evalution
            # Mean Squared error
            mse = mean_squared_error(y_test, y_predicted)

            # Root Mean Squared Error(RMSE)
            rmse = np.sqrt(mse)

            # R-Squared
            r2 = r2_score(y_test,y_predicted)




            
            return Response(
                {"Status" : "Sucess",
                 'plot_img' : plot_url,
                 'plot_100_dma' : plot_100_dma_url,
                 'plot_200_dma' : plot_200_dma_url,
                 'plot_prediction': plot_final_prediction_url,
                 'mse' : mse,
                 'rmse' : rmse,
                 'r2' : r2
                 }
                )


